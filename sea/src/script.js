import './style.css';
import { Pane } from 'tweakpane';
import * as THREE from 'three/src/Three';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Sky } from 'three/examples/jsm/objects/Sky';
import fragmentShader from './fragment.glsl';
import vertexShader from './vertex.glsl';
import { computeSiblingVertices } from './utils';

const pane = new Pane({ title: 'Parameters' });

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

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
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  42,
  sizes.width / sizes.height,
  0.1,
  100
);
window.camera = camera;
camera.position.x = 1.9894531139322313;
camera.position.y = 0.6350605844920187;
camera.position.z = 1.7650128324251322;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Cube
 */
const segments = 255;
const geometry = new THREE.PlaneGeometry(4, 4, segments, segments);
geometry.computeVertexNormals();

const positions = geometry.attributes.position.array;

const [as, cs, bs] = computeSiblingVertices(positions);

const normals = [];

const prevPositions = new Array(positions.length);
const nextPositions = new Array(positions.length);

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

  a.sub(b);
  c.sub(b);

  const normal = c.cross(a).normalize();
  normals.push(normal);
}

geometry.setAttribute(
  'aPrevPosition',
  new THREE.Float32BufferAttribute(prevPositions, 3)
);
geometry.setAttribute(
  'aNextPosition',
  new THREE.Float32BufferAttribute(nextPositions, 3)
);

const inputs = {
  lightColor: '#86b1fb',
  lightPower: 200,
  ambientColor: '#001063',
  diffuseColor: '#31439B',
  diffuseDarkColor: '#2c3a80',
  specColor: '#d6b1fc',
  shininess: 200,
  noiseStrength: 0.01,
  noiseFrequency: 0.5,
  noiseScale: 11,
  waveXStrength: 0.03,
  waveXFrequency: 5.0,
  waveYStrength: 0.015,
  waveYFrequency: 4.0,
};

const material = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uLightPos: {
      value: new THREE.Vector3(
        5.078997303068221,
        0.6350605844920187,
        4.211951517592416
      ),
    },
    uLightColor: { value: new THREE.Color(inputs.lightColor) },
    uLightPower: { value: inputs.lightPower },
    uAmbientColor: { value: new THREE.Color(inputs.ambientColor) },
    uDiffuseColor: { value: new THREE.Color(inputs.diffuseColor) },
    uDiffuseDarkColor: { value: new THREE.Color(inputs.diffuseDarkColor) },
    uSpecColor: { value: new THREE.Color(inputs.specColor) },
    uShininess: { value: inputs.shininess },
    uScreenGamma: { value: 2.2 },
    uNoiseStrength: { value: inputs.noiseStrength },
    uNoiseFrequency: { value: inputs.noiseFrequency },
    uNoiseScale: { value: inputs.noiseScale },
    uWaveXStrength: { value: inputs.waveXStrength },
    uWaveXFrequency: { value: inputs.waveXFrequency },
    uWaveYStrength: { value: inputs.waveYStrength },
    uWaveYFrequency: { value: inputs.waveYFrequency },
  },
  vertexShader,
  fragmentShader,
});

const lightFolder = pane.addFolder({
  title: 'Light',
});

lightFolder.addInput(inputs, 'lightColor', {
  view: 'color',
});
lightFolder.addInput(inputs, 'lightPower', {
  min: 0,
  max: 400,
});
lightFolder.addInput(inputs, 'ambientColor', {
  view: 'color',
});
lightFolder.addInput(inputs, 'diffuseColor', {
  view: 'color',
});
lightFolder.addInput(inputs, 'diffuseDarkColor', {
  view: 'color',
});
lightFolder.addInput(inputs, 'specColor', {
  view: 'color',
});
lightFolder.addInput(inputs, 'shininess', {
  min: 0.03,
  max: 500,
});

const waterFolder = pane.addFolder({
  title: 'Water',
});

waterFolder.addInput(inputs, 'noiseStrength', {
  min: 0.001,
  max: 0.02,
});
waterFolder.addInput(inputs, 'noiseFrequency', {
  min: 0,
  max: 1,
});
waterFolder.addInput(inputs, 'noiseScale', {
  min: 0,
  max: 20,
});

waterFolder.addInput(inputs, 'waveXStrength', {
  min: 0.001,
  max: 0.1,
});
waterFolder.addInput(inputs, 'waveXFrequency', {
  min: 0,
  max: 20,
});

waterFolder.addInput(inputs, 'waveYStrength', {
  min: 0.001,
  max: 0.1,
});
waterFolder.addInput(inputs, 'waveYFrequency', {
  min: 0,
  max: 20,
});

const cube = new THREE.Mesh(geometry, material);
cube.rotateX(-Math.PI * 0.5);
scene.add(cube);

const sunMaterial = new THREE.MeshBasicMaterial({
  color: '#990000',
});
const sunGeometry = new THREE.SphereGeometry(1, 32, 32);
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
sun.position.copy(material.uniforms.uLightPos.value);

window.sun = sun;

scene.add(sun);

const effectController = {
  turbidity: 10,
  rayleigh: 3,
  mieCoefficient: 0.005,
  mieDirectionalG: 0.7,
  elevation: 2,
  azimuth: 180,
};

const sky = new Sky();

const sunPosition = new THREE.Vector3();

var theta = Math.PI * (0.49 - 0.5);
var phi = 2 * Math.PI * (0.25 - 0.5);

sunPosition.x = Math.cos(phi);
sunPosition.y = Math.sin(phi) * Math.sin(theta);
sunPosition.z = Math.sin(phi) * Math.cos(theta);

const uniforms = sky.material.uniforms;
uniforms.turbidity.value = effectController.turbidity;
uniforms.rayleigh.value = effectController.rayleigh;
uniforms.mieCoefficient.value = effectController.mieCoefficient;
uniforms.mieDirectionalG.value = effectController.mieDirectionalG;
uniforms.sunPosition.value.copy(sunPosition);

sky.scale.setScalar(450000);
scene.add(sky);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// renderer.outputEncoding = THREE.sRGBEncoding;

/**
 * Animate
 */
const clock = new THREE.Clock();
let lastElapsedTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - lastElapsedTime;
  lastElapsedTime = elapsedTime;

  material.uniforms.uTime.value += deltaTime;

  material.uniforms.uLightColor.value.set(inputs.lightColor);
  material.uniforms.uLightPower.value = inputs.lightPower;
  material.uniforms.uAmbientColor.value.set(inputs.ambientColor);
  material.uniforms.uDiffuseColor.value.set(inputs.diffuseColor);
  material.uniforms.uDiffuseDarkColor.value.set(inputs.diffuseDarkColor);
  material.uniforms.uSpecColor.value.set(inputs.specColor);
  material.uniforms.uShininess.value = inputs.shininess;
  material.uniforms.uNoiseStrength.value = inputs.noiseStrength;
  material.uniforms.uNoiseFrequency.value = inputs.noiseFrequency;
  material.uniforms.uNoiseScale.value = inputs.noiseScale;
  material.uniforms.uWaveXStrength.value = inputs.waveXStrength;
  material.uniforms.uWaveXFrequency.value = inputs.waveXFrequency;
  material.uniforms.uWaveYStrength.value = inputs.waveYStrength;
  material.uniforms.uWaveYFrequency.value = inputs.waveYFrequency;

  material.uniforms.uLightPos.value.copy(sun.position);

  // Update controls
  controls.update();
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
