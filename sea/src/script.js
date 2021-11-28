import './style.css';
import { Pane } from 'tweakpane';
import * as THREE from 'three/src/Three';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Sky } from 'three/examples/jsm/objects/Sky';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import waterFragmentShader from './fragment.glsl';
import waterVertexShader from './vertex.glsl';
import starsFragmentShader from './stars-fragment.glsl';
import starsVertexShader from './stars-vertex.glsl';
import fogFragmentShader from './fog-fragment.glsl';
import fogVertexShader from './fog-vertex.glsl';
import { computeSiblingVertices } from './utils';

const pixelRatio = Math.min(window.devicePixelRatio, 2);

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

const starTextures = [];
const star7Texture = textureLoader.load('/star_07.png');
star7Texture.encoding = THREE.sRGBEncoding;
starTextures.push(star7Texture);
const star6Texture = textureLoader.load('/star_06.png');
star6Texture.encoding = THREE.sRGBEncoding;
starTextures.push(star6Texture);
const star8Texture = textureLoader.load('/star_08.png');
star8Texture.encoding = THREE.sRGBEncoding;
starTextures.push(star8Texture);
const star4Texture = textureLoader.load('/star_04.png');
star4Texture.encoding = THREE.sRGBEncoding;
starTextures.push(star4Texture);

const fog5Texture = textureLoader.load('/smoke_05.png');
fog5Texture.encoding = THREE.sRGBEncoding;

/**
 * Debug pane
 */
const pane = new Pane({ title: 'Parameters' });

/**
 * Ship Model
 */
const gltfLoader = new GLTFLoader();

let shipModel = undefined;

gltfLoader.load(
  '/ship/scene.gltf',
  (gltf) => {
    const scalar = 0.0025;
    shipModel = gltf.scene.children[0];
    shipModel.traverse((child) => {
      if (
        child?.type === 'Mesh' &&
        child?.material?.type === 'MeshStandardMaterial'
      ) {
        child.castShadow = true;
        child.receiveShadow = true;

        if (child?.material?.map) {
          child.material.map.encoding = THREE.sRGBEncoding;
        }
      }
    });
    shipModel.position.y = 0.03;
    shipModel.scale.set(scalar, scalar, scalar);
    scene.add(shipModel);
  },
  (progress) => {
    console.log('progress');
  },
  (error) => {
    console.log('error');
  }
);

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Lights
 */
var light = new THREE.AmbientLight(0x00fffc, 4.2);
scene.add(light);

const directionalLight = new THREE.DirectionalLight(0x00fffc, 6.08);
directionalLight.castShadow = true;
directionalLight.shadow.normalBias = 0.05;
scene.add(directionalLight);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(pixelRatio);
});

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(
  50,
  sizes.width / sizes.height,
  0.1,
  15
);
window.camera = camera;
camera.position.x = -1.2658957007660163;
camera.position.y = 0.3550630876767142;
camera.position.z = 2.7295812735649627;

const cameraRotation = new THREE.Vector3(
  -0.1293533695124764,
  -0.4310517757038594,
  -0.05429733203978356
);
camera.rotation.set(cameraRotation.x, cameraRotation.y, cameraRotation.z);

scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Water
 */
const segments = 511;
const waterGeometry = new THREE.PlaneGeometry(16, 16, segments, segments);

// adjacent vertices used for normal computation of transformed geometry
const waterPositions = waterGeometry.attributes.position.array;
const [as, cs, bs] = computeSiblingVertices(waterPositions);
const prevPositions = new Array(waterPositions.length);
const nextPositions = new Array(waterPositions.length);
for (let i = 0; i < bs.length; i++) {
  const a = as[i];
  const b = bs[i];
  const c = cs[i];

  const ix = i * 3;
  const iy = ix + 1;
  const iz = iy + 1;

  prevPositions[ix] = a.x;
  prevPositions[iy] = a.y;
  prevPositions[iz] = a.z;

  nextPositions[ix] = c.x;
  nextPositions[iy] = c.y;
  nextPositions[iz] = c.z;
}
waterGeometry.setAttribute(
  'aPrevPosition',
  new THREE.Float32BufferAttribute(prevPositions, 3)
);
waterGeometry.setAttribute(
  'aNextPosition',
  new THREE.Float32BufferAttribute(nextPositions, 3)
);

const waterParams = {
  lightColor: '#86b1fb',
  lightPower: 120.29,
  ambientColor: '#3680af',
  diffuseColor: '#3c99cb',
  diffuseDarkColor: '#2d78a0',
  specColor: '#ffffff',
  shininess: 166.69,
  noiseStrength: 0.01,
  noiseFrequency: 0.65,
  noiseScale: 12.97,
  waveXStrength: 0.04,
  waveXFrequency: 4.71,
  waveYStrength: 0.084,
  waveYFrequency: 2.75,
};

const waterMaterial = new THREE.ShaderMaterial({
  transparent: true,
  uniforms: {
    uTime: { value: 0 },
    uLightPos: {
      value: new THREE.Vector3(
        1.078997303068221,
        0.6350605844920187,
        4.211951517592416
      ),
    },
    uLightColor: { value: new THREE.Color(waterParams.lightColor) },
    uLightPower: { value: waterParams.lightPower },
    uAmbientColor: { value: new THREE.Color(waterParams.ambientColor) },
    uDiffuseColor: { value: new THREE.Color(waterParams.diffuseColor) },
    uDiffuseDarkColor: { value: new THREE.Color(waterParams.diffuseDarkColor) },
    uSpecColor: { value: new THREE.Color(waterParams.specColor) },
    uShininess: { value: waterParams.shininess },
    uScreenGamma: { value: 2.2 },
    uNoiseStrength: { value: waterParams.noiseStrength },
    uNoiseFrequency: { value: waterParams.noiseFrequency },
    uNoiseScale: { value: waterParams.noiseScale },
    uWaveXStrength: { value: waterParams.waveXStrength },
    uWaveXFrequency: { value: waterParams.waveXFrequency },
    uWaveYStrength: { value: waterParams.waveYStrength },
    uWaveYFrequency: { value: waterParams.waveYFrequency },
  },
  vertexShader: waterVertexShader,
  fragmentShader: waterFragmentShader,
});

const lightFolder = pane.addFolder({
  title: 'Water Colors',
});
lightFolder.addInput(waterParams, 'lightColor', {
  view: 'color',
});
lightFolder.addInput(waterParams, 'lightPower', {
  min: 0,
  max: 400,
});
lightFolder.addInput(waterParams, 'ambientColor', {
  view: 'color',
});
lightFolder.addInput(waterParams, 'diffuseColor', {
  view: 'color',
});
lightFolder.addInput(waterParams, 'diffuseDarkColor', {
  view: 'color',
});
lightFolder.addInput(waterParams, 'specColor', {
  view: 'color',
});
lightFolder.addInput(waterParams, 'shininess', {
  min: 0.03,
  max: 500,
});

const waterFolder = pane.addFolder({
  title: 'Water Geometry',
});
waterFolder.addInput(waterParams, 'noiseStrength', {
  min: 0.001,
  max: 0.02,
});
waterFolder.addInput(waterParams, 'noiseFrequency', {
  min: 0,
  max: 1,
});
waterFolder.addInput(waterParams, 'noiseScale', {
  min: 0,
  max: 20,
});
waterFolder.addInput(waterParams, 'waveXStrength', {
  min: 0.001,
  max: 0.1,
});
waterFolder.addInput(waterParams, 'waveXFrequency', {
  min: 0,
  max: 20,
});
waterFolder.addInput(waterParams, 'waveYStrength', {
  min: 0.001,
  max: 0.1,
});
waterFolder.addInput(waterParams, 'waveYFrequency', {
  min: 0,
  max: 20,
});

const waterMesh = new THREE.Mesh(waterGeometry, waterMaterial);
waterMesh.rotateX(-Math.PI * 0.5);
scene.add(waterMesh);

const sunMaterial = new THREE.MeshBasicMaterial({
  color: '#990000',
});
const sunGeometry = new THREE.SphereGeometry(1, 32, 32);
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
sun.position.copy(waterMaterial.uniforms.uLightPos.value);
window.sun = sun;
scene.add(sun);

/**
 * Sky
 */
const skyParams = {
  turbidity: 0.03,
  rayleigh: 0.12,
  mieCoefficient: 0.004,
  mieDirectionalG: 0.508,
  elevation: 12.39,
  azimuth: 180,
};

const skyFolder = pane.addFolder({
  title: 'Sky',
});
skyFolder.addInput(skyParams, 'turbidity', {
  min: -1,
  max: 3,
});
skyFolder.addInput(skyParams, 'rayleigh', {
  min: 0,
  max: 3,
});
skyFolder.addInput(skyParams, 'mieCoefficient', {
  min: 0,
  max: 0.01,
});
skyFolder.addInput(skyParams, 'mieDirectionalG', {
  min: -1,
  max: 3,
});
skyFolder.addInput(skyParams, 'elevation', {
  min: 0,
  max: 90,
});
skyFolder.addInput(skyParams, 'azimuth', {
  min: -180,
  max: 180,
});

const sky = new Sky();

const sunPosition = new THREE.Vector3();

const uniforms = sky.material.uniforms;
uniforms.turbidity.value = skyParams.turbidity;
uniforms.rayleigh.value = skyParams.rayleigh;
uniforms.mieCoefficient.value = skyParams.mieCoefficient;
uniforms.mieDirectionalG.value = skyParams.mieDirectionalG;

const phi = THREE.MathUtils.degToRad(90 - skyParams.elevation);
const theta = THREE.MathUtils.degToRad(skyParams.azimuth);
sunPosition.setFromSphericalCoords(1, phi, theta);
uniforms.sunPosition.value.copy(sunPosition);

sky.scale.setScalar(450000);
scene.add(sky);

/**
 * Stars
 */
const starsGeometry = new THREE.BufferGeometry();
const count = 500;

const starPositions = new Float32Array(count * 3);
for (let i = 0; i < count * 3; i += 3) {
  const phi = THREE.MathUtils.degToRad(90 * Math.random());
  const theta = THREE.MathUtils.degToRad(180 + Math.random() * 365);
  const startPosition = new THREE.Vector3();
  startPosition.setFromSphericalCoords(1, phi, theta);
  startPosition.multiplyScalar(9);

  starPositions[i] = startPosition.x;
  starPositions[i + 1] = startPosition.y;
  starPositions[i + 2] = startPosition.z;
}
starsGeometry.setAttribute(
  'position',
  new THREE.BufferAttribute(starPositions, 3)
);

const starScales = new Float32Array(count);
const starTextureIndex = new Float32Array(count);
for (let i = 0; i < count; i++) {
  starScales[i] = 0.5 + Math.random() * 0.5;
  starTextureIndex[i] = Math.floor(starTextures.length * Math.random());
}
starsGeometry.setAttribute('aScale', new THREE.BufferAttribute(starScales, 1));
starsGeometry.setAttribute(
  'aTextureIndex',
  new THREE.BufferAttribute(starTextureIndex, 1)
);

const starsMaterial = new THREE.ShaderMaterial({
  transparent: true,
  defines: {
    texturesCount: starTextures.length,
  },
  uniforms: {
    uTexture: { value: star7Texture },
    uTextures: new THREE.Uniform(starTextures),
    uSize: { value: 10 * pixelRatio },
    uTime: { value: 0 },
  },
  fragmentShader: starsFragmentShader,
  vertexShader: starsVertexShader,
});

const stars = new THREE.Points(starsGeometry, starsMaterial);
scene.add(stars);

/**
 * Fog
 */
const fogGeometry = new THREE.BufferGeometry();
const fogCount = 200;

const fogPositions = new Float32Array(fogCount * 3);
for (let i = 0; i < fogCount * 3; i += 3) {
  const phi = THREE.MathUtils.degToRad(Math.abs(5 * Math.random() - 90));
  const theta = THREE.MathUtils.degToRad(180 + Math.random() * 365);
  const fogPosition = new THREE.Vector3();
  fogPosition.setFromSphericalCoords(1, phi, theta);
  fogPosition.multiplyScalar(5);

  fogPositions[i] = fogPosition.x;
  fogPositions[i + 1] = fogPosition.y;
  fogPositions[i + 2] = fogPosition.z;
}
fogGeometry.setAttribute(
  'position',
  new THREE.BufferAttribute(fogPositions, 3)
);

const fogScales = new Float32Array(fogCount);
const fogRand = new Float32Array(fogCount);
for (let i = 0; i < fogCount; i++) {
  fogScales[i] = 0.5 + Math.random() * 0.5;
  fogRand[i] = (Math.random() - 0.5) * 5;
}
fogGeometry.setAttribute('aScale', new THREE.BufferAttribute(fogScales, 1));
fogGeometry.setAttribute('aRand', new THREE.BufferAttribute(fogRand, 1));

const fogMaterial = new THREE.ShaderMaterial({
  transparent: true,
  depthWrite: false,
  blending: THREE.NormalBlending,
  uniforms: {
    uTexture: { value: fog5Texture },
    uSize: { value: 100 * pixelRatio },
    uTime: { value: 0 },
  },
  fragmentShader: fogFragmentShader,
  vertexShader: fogVertexShader,
});

const fog = new THREE.Points(fogGeometry, fogMaterial);
scene.add(fog);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(pixelRatio);
renderer.physicallyCorrectLights = true;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.2;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

/**
 * Animate
 */
const clock = new THREE.Clock();
let lastElapsedTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - lastElapsedTime;
  lastElapsedTime = elapsedTime;

  waterMaterial.uniforms.uTime.value += deltaTime;
  starsMaterial.uniforms.uTime.value += deltaTime;
  fogMaterial.uniforms.uTime.value += deltaTime;

  waterMaterial.uniforms.uLightColor.value.set(waterParams.lightColor);
  waterMaterial.uniforms.uLightPower.value = waterParams.lightPower;
  waterMaterial.uniforms.uAmbientColor.value.set(waterParams.ambientColor);
  waterMaterial.uniforms.uDiffuseColor.value.set(waterParams.diffuseColor);
  waterMaterial.uniforms.uDiffuseDarkColor.value.set(
    waterParams.diffuseDarkColor
  );
  waterMaterial.uniforms.uSpecColor.value.set(waterParams.specColor);
  waterMaterial.uniforms.uShininess.value = waterParams.shininess;
  waterMaterial.uniforms.uNoiseStrength.value = waterParams.noiseStrength;
  waterMaterial.uniforms.uNoiseFrequency.value = waterParams.noiseFrequency;
  waterMaterial.uniforms.uNoiseScale.value = waterParams.noiseScale;
  waterMaterial.uniforms.uWaveXStrength.value = waterParams.waveXStrength;
  waterMaterial.uniforms.uWaveXFrequency.value = waterParams.waveXFrequency;
  waterMaterial.uniforms.uWaveYStrength.value = waterParams.waveYStrength;
  waterMaterial.uniforms.uWaveYFrequency.value = waterParams.waveYFrequency;

  waterMaterial.uniforms.uLightPos.value.copy(sun.position);

  uniforms.turbidity.value = skyParams.turbidity;
  uniforms.rayleigh.value = skyParams.rayleigh;
  uniforms.mieCoefficient.value = skyParams.mieCoefficient;
  uniforms.mieDirectionalG.value = skyParams.mieDirectionalG;

  const phi = THREE.MathUtils.degToRad(90 - skyParams.elevation);
  const theta = THREE.MathUtils.degToRad(skyParams.azimuth);
  sunPosition.setFromSphericalCoords(1, phi, theta);
  directionalLight.position.copy(sunPosition);
  uniforms.sunPosition.value.copy(sunPosition);

  if (shipModel) {
    shipModel.rotation.x = Math.PI * -0.5 + Math.sin(elapsedTime) * 0.07;
  }

  camera.position.y += Math.sin(elapsedTime) * 0.0005;
  camera.rotation.z = cameraRotation.z + Math.sin(elapsedTime) * 0.02;

  // Update controls
  // controls.update();
  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

const transformControl = new TransformControls(camera, renderer.domElement);
transformControl.addEventListener('change', tick);
transformControl.addEventListener('dragging-changed', function (event) {
  controls.enabled = !event.value;
});
transformControl.attach(sun);
scene.add(transformControl);

tick();
