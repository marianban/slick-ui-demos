import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import fragmentShader from './fragment.glsl';
import vertexShader from './vertex.glsl';

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
// camera.position.x = 1;
camera.position.y = 0.2;
camera.position.z = 0.5;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Cube
 */
const segments = 5;
const geometry = new THREE.PlaneGeometry(1, 1, segments, segments);
geometry.computeVertexNormals();

const positions = geometry.attributes.position.array;

const prevPositions = new Array(positions.length);
const nextPositions = new Array(positions.length);

for (let i = 3; i < positions.length; i += 3) {
  prevPositions[i + 0] = positions[i - 3 + 0];
  prevPositions[i + 1] = positions[i - 3 + 1];
  prevPositions[i + 2] = positions[i - 3 + 2];

  if (!(i % (segments * 3 + 3))) {
    prevPositions[i + 0] = positions[i];
    prevPositions[i + 1] = positions[i + 1];
    prevPositions[i + 2] = positions[i + 2];
  }
}
prevPositions[0] = positions[0];
prevPositions[1] = positions[1];
prevPositions[2] = positions[2];

for (let i = 0; i < positions.length - 3; i += 3) {
  nextPositions[i + 0] = positions[i + 3 + 0];
  nextPositions[i + 1] = positions[i + 3 + 1];
  nextPositions[i + 2] = positions[i + 3 + 2];

  if (!((i + 3) % (segments * 3 + 3))) {
    nextPositions[i + 0] = positions[i];
    nextPositions[i + 1] = positions[i + 1];
    nextPositions[i + 2] = positions[i + 2];
  }
}
nextPositions[positions.length - 1] = positions[positions.length - 1];
nextPositions[positions.length - 2] = positions[positions.length - 2];
nextPositions[positions.length - 3] = positions[positions.length - 3];

const normals = new Array(positions.length);

for (let i = 0; i < positions.length; i += 3) {
  const prevX = prevPositions[i];
  const prevY = prevPositions[i + 1];
  const prevZ = prevPositions[i + 2];
  const prev = new THREE.Vector3(prevX, prevY, prevZ);

  const posX = positions[i];
  const posY = positions[i + 1];
  const posZ = positions[i + 2];
  const pos = new THREE.Vector3(posX, posY, posZ);

  const nextX = nextPositions[i];
  const nextY = nextPositions[i + 1];
  const nextZ = nextPositions[i + 2];
  const next = new THREE.Vector3(nextX, nextY, nextZ);

  console.log('_________');
  console.log(prev.clone());
  console.log(pos.clone());
  console.log(next.clone());

  prev.sub(pos);
  next.sub(pos);

  console.log(prev.clone());
  console.log(next.clone());

  // if (i === 3 * 250 * 4) {

  // }

  const normal = next.cross(prev);

  normals[i] = normal.x;
  normals[i + 1] = normal.y;
  normals[i + 2] = normal.z;
}

console.log(normals);
console.log(geometry.attributes.normal.array);

geometry.setAttribute(
  'aPrevPosition',
  new THREE.Float32BufferAttribute(prevPositions, 3)
);
geometry.setAttribute(
  'aNextPosition',
  new THREE.Float32BufferAttribute(nextPositions, 3)
);

// for (let i = 0; i < positions.length - 3; i += 3) {
//   if (positions[i + 3] !== nextPositions[i]) {
//     throw new Error('error');
//   }
// }

// for (let i = 3; i < positions.length; i += 3) {
//   if (positions[i - 3] !== prevPositions[i]) {
//     throw new Error('error prev');
//   }
// }

console.log({
  prevPositions,
  positions,
  nextPositions,
});

let material = new THREE.MeshBasicMaterial({
  color: '#990000',
});
material = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
  },
  vertexShader,
  fragmentShader,
});

const cube = new THREE.Mesh(geometry, material);
cube.rotateX(-Math.PI * 0.5);
scene.add(cube);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

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

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
