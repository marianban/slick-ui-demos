import './style.css';
import { Pane } from 'tweakpane';
import * as THREE from 'three';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Sky } from 'three/examples/jsm/objects/Sky';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import waterFragmentShader from './fragment.glsl';
import waterVertexShader from './vertex.glsl';
import starsFragmentShader from './stars-fragment.glsl';
import starsVertexShader from './stars-vertex.glsl';
import fogFragmentShader from './fog-fragment.glsl';
import fogVertexShader from './fog-vertex.glsl';
import flagFragment from './flag-fragment.glsl';
import flagVertex from './flag-vertex.glsl';
import { computeSiblingVertices } from './utils';
import { select } from 'd3-selection';
import 'd3-transition';
import { easeSinInOut } from 'd3-ease';

const pixelRatio = Math.min(window.devicePixelRatio, 2);

const turbulence = select('#turbulence');
const duration = 3000;

let next = 0.03;
let prev = 0.02;

function animate() {
  // safari specific hack
  // text.style('filter', 'url(#filter)');

  turbulence
    .attr('baseFrequency', next)
    .transition()
    .ease(easeSinInOut)
    .duration(duration * 2)
    .attr('baseFrequency', prev)
    .on('end', () => {
      // force filter rest in safari
      // text.style('filter', 'none');

      [next, prev] = [prev, next];

      window.requestAnimationFrame(animate);
    });
}

window.requestAnimationFrame(animate);

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

const flagTexture = textureLoader.load('/flag3.jpg');
flagTexture.encoding = THREE.sRGBEncoding;

/**
 * Debug pane
 */
const pane = new Pane({ title: 'Parameters' });

// Canvas
const canvas = document.querySelector('canvas.webgl');

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Scene
const scene = new THREE.Scene();

/**
 * Camera
 */
const cameraPosition = new THREE.Vector3(
  -1.2658957007660163,
  0.3550630876767142,
  2.7295812735649627
);
const camera = new THREE.PerspectiveCamera(
  50,
  sizes.width / sizes.height,
  0.1,
  15
);
window.camera = camera;

camera.position.x = cameraPosition.x;
camera.position.y = cameraPosition.y;
camera.position.z = cameraPosition.z;

const cameraRotation = new THREE.Vector3(
  -0.1293533695124764,
  -0.4310517757038594,
  -0.05429733203978356
);
camera.rotation.set(cameraRotation.x, cameraRotation.y, cameraRotation.z);

scene.add(camera);

/**
 * Lights
 */
var light = new THREE.AmbientLight(0xdddddd, 1.5);
scene.add(light);

const directionalLight = new THREE.DirectionalLight(0xdddddd, 4.08);
// directionalLight.castShadow = true;
directionalLight.shadow.normalBias = 0.05;
scene.add(directionalLight);

const pointLightIntensity = 1;
const pointLightPower = 20;
const pointLight = new THREE.PointLight(0xf0e1a5, pointLightIntensity, 1, 1);
pointLight.power = pointLightPower;

// const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.1);
// scene.add(pointLightHelper);
scene.add(pointLight);

/**
 * Ship Model
 */
const shipGroup = new THREE.Group();
scene.add(shipGroup);

const gltfLoader = new GLTFLoader();

let shipModel = undefined;
const shipY = 0.025;
let cameraDistance = undefined;

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
        // child.castShadow = true;
        // child.receiveShadow = true;

        if (child?.material?.map) {
          child.material.map.encoding = THREE.sRGBEncoding;
        }
      }
    });

    shipModel.scale.set(scalar, scalar, scalar);
    shipGroup.position.y = shipY;
    shipGroup.add(shipModel);

    const cameraToShip = new THREE.Vector3();
    cameraToShip.subVectors(shipModel.position, camera.position);
    cameraDistance = cameraToShip.length();
  },
  (progress) => {
    console.log('progress');
  },
  (error) => {
    console.log('error');
  }
);

/**
 * Lantern Model
 */
let lanternModel = undefined;
let lanternEmissiveMaterial = undefined;

gltfLoader.load(
  '/stylized_lantern/scene.gltf',
  (gltf) => {
    const scalar = 0.01;
    lanternModel = gltf.scene.children[0];
    lanternModel.traverse((child) => {
      if (
        child?.type === 'Mesh' &&
        child?.material?.type === 'MeshStandardMaterial'
      ) {
        if (child.name === 'second_lambert2_0') {
          child.material.emissiveIntensity = 30;
          lanternEmissiveMaterial = child.material;
        }

        if (child?.material?.map) {
          child.material.map.encoding = THREE.sRGBEncoding;
        }
      }
    });
    lanternModel.position.z = -0.01;
    lanternModel.position.y = 0.3;
    lanternModel.scale.set(scalar, scalar, scalar);
    lanternModel.add(pointLight);
    shipGroup.add(lanternModel);
  },
  (progress) => {
    console.log('progress');
  },
  (error) => {
    console.log('error');
  }
);

/**
 * Sizes
 */

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
  lightPower: 120.29,
  lightColor: '#2d446b',
  // lightColor: '#86b1fb',
  ambientColor: '#18384d',
  // ambientColor: '#3680af',
  diffuseColor: '#205978',
  // diffuseColor: '#3c99cb',
  diffuseDarkColor: '#143547',
  // diffuseDarkColor: '#2d78a0',
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
  side: THREE.DoubleSide,
  // blending: THREE.NoBlending,
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

// const sunMaterial = new THREE.MeshBasicMaterial({
//   color: '#990000',
// });
// const sunGeometry = new THREE.SphereGeometry(1, 32, 32);
// const sun = new THREE.Mesh(sunGeometry, sunMaterial);
// sun.position.copy(waterMaterial.uniforms.uLightPos.value);
// window.sun = sun;
// scene.add(sun);

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
const count = 1500;

const starPositions = new Float32Array(count * 3);
for (let i = 0; i < count * 3; i += 3) {
  const phi = THREE.MathUtils.degToRad(85 * Math.sqrt(Math.random()));
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
  starScales[i] = 0.5 + Math.random();
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
const fogCount = 2000;

const fogPositions = new Float32Array(fogCount * 3);
for (let i = 0; i < fogCount * 3; i += 3) {
  const phi = THREE.MathUtils.degToRad(
    90 - 10 * (Math.random() * Math.random() * Math.random())
  );
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
  // blending: THREE.AdditiveBlending,
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
 * Flag
 */
const flagSize = 0.15;
const flagGeometry = new THREE.PlaneGeometry(
  flagSize,
  flagSize / 1.9,
  100,
  100
);
const flagMaterial = new THREE.ShaderMaterial({
  side: THREE.DoubleSide,
  uniforms: {
    uTime: { value: 0 },
    uTexture: { value: flagTexture },
    uDarkColor: { value: new THREE.Color('#73000c').convertSRGBToLinear() },
  },
  vertexShader: flagVertex,
  fragmentShader: flagFragment,
});
const flag = new THREE.Mesh(flagGeometry, flagMaterial);

flag.position.y = 1.112;
flag.position.x = 0.0627;
flag.position.z = 0.051;
flag.rotation.y = -0.6;
flag.scale.x = -1;
window.flag = flag;

shipGroup.add(flag);

/**
 * Controls
 */

let cameraAngle = 0;
let angularVelocity = 0;

window.addEventListener('mousemove', (event) => {
  const x = (event.x / sizes.width - 0.5) * 2;

  angularVelocity = -(x * 0.1);
});

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
renderer.toneMappingExposure = 0.3;
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
  flagMaterial.uniforms.uTime.value += deltaTime;

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

  // waterMaterial.uniforms.uLightPos.value.copy(sun.position);

  uniforms.turbidity.value = skyParams.turbidity;
  uniforms.rayleigh.value = skyParams.rayleigh;
  uniforms.mieCoefficient.value = skyParams.mieCoefficient;
  uniforms.mieDirectionalG.value = skyParams.mieDirectionalG;

  const phi = THREE.MathUtils.degToRad(90 - skyParams.elevation);
  const theta = THREE.MathUtils.degToRad(skyParams.azimuth);
  sunPosition.setFromSphericalCoords(1, phi, theta);
  directionalLight.position.copy(sunPosition);
  uniforms.sunPosition.value.copy(sunPosition);

  if (shipGroup) {
    const shipXRotation = Math.sin(elapsedTime) * 0.07;
    shipGroup.position.y = Math.sin(elapsedTime) * 0.05;
    shipGroup.rotation.x = shipXRotation;
  }

  if (cameraDistance) {
    camera.rotation.z = camera.rotation.z + Math.sin(elapsedTime) * 0.02;

    cameraAngle += angularVelocity * deltaTime;

    camera.position.x =
      shipGroup.position.x + Math.cos(cameraAngle) * cameraDistance;
    camera.position.z =
      shipGroup.position.z + Math.sin(cameraAngle) * cameraDistance;
  }

  camera.position.y = cameraPosition.y + Math.sin(elapsedTime) * 0.1;

  const lightChange =
    (Math.sin(elapsedTime * 3) - Math.sin(elapsedTime * 10)) * 4;

  pointLight.power = pointLightPower + lightChange;

  if (lanternEmissiveMaterial) {
    // console.log(lightChange * 10);
    lanternEmissiveMaterial.emissiveIntensity = 20 + lightChange * 2;
  }

  // Render
  renderer.render(scene, camera);

  if (shipGroup) {
    camera.lookAt(shipGroup.position);
  }

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

// const transformControl = new TransformControls(camera, renderer.domElement);
// transformControl.addEventListener('change', tick);
// // transformControl.addEventListener('dragging-changed', function (event) {
// //   //controls.enabled = !event.value;
// // });
// transformControl.attach(flag);
// scene.add(transformControl);

tick();
