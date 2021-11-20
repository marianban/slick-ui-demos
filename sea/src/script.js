import './style.css';
import * as THREE from 'three/src/Three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import fragmentShader from './fragment.glsl';
import vertexShader from './vertex.glsl';
import { computeSiblingVertices } from './utils';

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
const segments = 63;
const geometry = new THREE.PlaneGeometry(1, 1, segments, segments);
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

console.log({ prevPositions, nextPositions });

console.log(geometry.attributes.normal.array);

console.log(normals);

// const normals = new Array(positions.length);

// for (let i = 0; i < positions.length; i += 3) {

//   prev.sub(pos);
//   next.sub(pos);

//   const normal = next.cross(prev);

//   normals[i] = normal.x;
//   normals[i + 1] = normal.y;
//   normals[i + 2] = normal.z;
// }

geometry.setAttribute(
  'aPrevPosition',
  new THREE.Float32BufferAttribute(prevPositions, 3)
);
geometry.setAttribute(
  'aNextPosition',
  new THREE.Float32BufferAttribute(nextPositions, 3)
);

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
