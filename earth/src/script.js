import './style.css';
import * as THREE from 'three';
import * as dat from 'dat.gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const canvas = document.querySelector('canvas.webgl');
const pixelRatio = Math.min(window.devicePixelRatio, 2);

/**
 * Debug
 */
const gui = new dat.GUI();

// source https://www.solarsystemscope.com/textures/
const textureLoader = new THREE.TextureLoader();
const colorTexture = textureLoader.load('/8k_earth_daymap.jpg');
colorTexture.magFilter = THREE.NearestFilter;
const normalTexture = textureLoader.load('/8k_earth_normal_map.png');
const specularTexture = textureLoader.load('/8k_earth_specular_map.png');
const cloudsTexture = textureLoader.load('/Earth-clouds.png');

// http://www.cgchannel.com/2021/01/get-a-free-43200-x-21600px-displacement-map-of-the-earth/
const displacementTexture = textureLoader.load(
  '/EARTH_DISPLACE_42K_16BITS_preview.jpg'
);

const cubeTextureLoader = new THREE.CubeTextureLoader();

const environmentMapTexture = cubeTextureLoader.load([
  '/space/px.png',
  '/space/nx.png',
  '/space/py.png',
  '/space/ny.png',
  '/space/pz.png',
  '/space/nz.png',
]);

const scene = new THREE.Scene();

scene.background = environmentMapTexture;

const earthSegments = 1000;
const earthGeometry = new THREE.SphereGeometry(2, earthSegments, earthSegments);
const earthMaterial = new THREE.MeshPhongMaterial({
  map: colorTexture,
  specularMap: specularTexture,
  specular: new THREE.Color(0x111111),
  shininess: 25,
  normalMap: normalTexture,
  displacementMap: displacementTexture,
  displacementScale: 0.03,
});

// material.normalScale.set(-1, -1);
// material.normalScale.set(0.5, 0.5)
// gui.add(material, 'metalness').min(0).max(1).step(0.0001);
// gui.add(material, 'roughness').min(0).max(1).step(0.0001);
const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earthMesh);

const couldSegments = 200;
const cloudGeometry = new THREE.SphereGeometry(
  2.05,
  couldSegments,
  couldSegments
);
const cloudMaterial = new THREE.MeshPhongMaterial({
  // try to use jpeg and blend modes
  // http://www.shadedrelief.com/natural3/pages/clouds.html
  map: cloudsTexture,
  side: THREE.DoubleSide,
  opacity: 0.8,
  transparent: true,
  depthWrite: true,
});
const cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
earthMesh.add(cloudMesh);

// tutorial
//learningthreejs.com/blog/2013/09/16/how-to-make-the-earth-in-webgl/

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

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0x00fffc, 1.3);
directionalLight.position.set(8, 0.0, 0);
scene.add(directionalLight);

const directionalLightHelper = new THREE.DirectionalLightHelper(
  directionalLight,
  0.2
);
scene.add(directionalLightHelper);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(pixelRatio);
renderer.render(scene, camera);

const tick = () => {
  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
