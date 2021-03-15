import './style.css';
import * as THREE from 'three';
import * as dat from 'dat.gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { VertexNormalsHelper } from 'three/examples/jsm/helpers/VertexNormalsHelper';

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const canvas = document.querySelector('canvas.webgl');
const pixelRatio = Math.min(window.devicePixelRatio, 2);

/**
 * Debug
 */
const gui = new dat.GUI();
const parameters = {};

// source https://www.solarsystemscope.com/textures/
const textureLoader = new THREE.TextureLoader();
const dayTexture = textureLoader.load('/8k_earth_daymap.jpg');
const nightTexture = textureLoader.load('/8k_earth_nightmap.jpg');
const normalTexture = textureLoader.load('/8k_earth_normal_map.png');
const specularTexture = textureLoader.load('/8k_earth_specular_map.png');
// const cloudsTexture = textureLoader.load('/Earth-clouds.png');
const cloudsTexture = textureLoader.load('/8k_earth_clouds.jpg');

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

// Camera

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 4;
scene.add(camera);

// Materials

const earthSegments = 1000;
const earthGeometry = new THREE.SphereGeometry(2, earthSegments, earthSegments);
const earthMaterial = new THREE.MeshPhongMaterial({
  map: dayTexture,
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
  2.03,
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
  depthWrite: false,
  blending: THREE.CustomBlending,
  blendEquation: THREE.MaxEquation,
});
const cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
earthMesh.add(cloudMesh);

const nightGeometry = new THREE.SphereGeometry(
  2.019,
  couldSegments,
  couldSegments
);
// TODO: apply transparency to texture base on the angle between normal and light direction
const nightMaterial = new THREE.ShaderMaterial({
  uniforms: {
    uTexture: { value: nightTexture },
    uLightPosition: { value: directionalLight.position },
  },
  side: THREE.FrontSide,
  transparent: true,
  depthWrite: false,
  vertexShader: `
   uniform vec3 uLightPosition;

   varying vec2 vUv;
   varying float vAlpha;

   void main() {
      vec4 vViewPosition4 = modelViewMatrix * vec4(position, 1.0);
      vec3 vViewPosition = vViewPosition4.xyz;
      vec3 normal = normalize(normalMatrix * normal);
      vec4 viewLightPosition4 = viewMatrix * vec4(uLightPosition, 1.0);
      vec3 lightDirection = normalize(viewLightPosition4.xyz - vViewPosition);

      gl_Position = projectionMatrix * vViewPosition4;

      vAlpha = abs(min(0.0, dot(lightDirection, normal)));
      vUv = uv;
   }
  `,
  fragmentShader: `
    uniform sampler2D uTexture;

    varying vec2 vUv;
    varying float vAlpha;

    void main() {
      vec4 textureColor = texture2D(uTexture, vUv);
      gl_FragColor = vec4(textureColor.rgb, vAlpha);
    }
  `,
});
const nightMesh = new THREE.Mesh(nightGeometry, nightMaterial);
earthMesh.add(nightMesh);

const helper = new VertexNormalsHelper(nightMesh, 2, 0x00ff00, 1);
// scene.add(helper);

parameters.c = 0.1;
parameters.p = 1.2;
// reference http://stemkoski.github.io/Three.js/Shader-Glow.html
const atmosphereMaterial = new THREE.ShaderMaterial({
  uniforms: {
    c: { value: parameters.c },
    p: { value: parameters.p },
    glowColor: { value: new THREE.Color(0x034d8e) },
    viewVector: { value: camera.position },
  },
  vertexShader: `
    uniform vec3 viewVector;
    uniform float c;
    uniform float p;
    varying float intensity;
    void main()
    {
        vec3 vNormal = normalize( normalMatrix * normal );
        vec3 vNormel = normalize( normalMatrix * viewVector );
        intensity = pow( c - dot(vNormal, vNormel), p );

        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
  `,
  fragmentShader: `
    uniform vec3 glowColor;
    varying float intensity;
    void main()
    {
      vec3 glow = glowColor * intensity;
      gl_FragColor = vec4( glow, 1.0 );
    }
  `,
  side: THREE.BackSide,
  blending: THREE.AdditiveBlending,
  transparent: true,
});
gui
  .add(atmosphereMaterial.uniforms.c, 'value')
  .min(0)
  .max(1)
  .step(0.0001)
  .name('atmosphere.c');
gui
  .add(atmosphereMaterial.uniforms.p, 'value')
  .min(0)
  .max(6)
  .step(0.0001)
  .name('atmosphere.p');

const atmosphereGeometry = new THREE.SphereGeometry(2.5, 128, 128);
const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
earthMesh.add(atmosphereMesh);

// tutorial
//learningthreejs.com/blog/2013/09/16/how-to-make-the-earth-in-webgl/

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

/**
 * Post processing
 */
const effectComposer = new EffectComposer(renderer);
effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
effectComposer.setSize(sizes.width, sizes.height);

// const renderPass = new RenderPass(scene, camera);
// effectComposer.addPass(renderPass);

// const unrealBloomPass = new UnrealBloomPass();
// unrealBloomPass.enabled = false;
// unrealBloomPass.strength = 0.3;
// unrealBloomPass.radius = 1.0;
// unrealBloomPass.threshold = 0.6;
// gui.add(unrealBloomPass, 'strength').min(0).max(3).step(0.0001);
// gui.add(unrealBloomPass, 'radius').min(0).max(1).step(0.0001);
// gui.add(unrealBloomPass, 'threshold').min(0).max(1).step(0.0001);
// // gui.add(unrealBloomPass, 'exposure').min(0).max(2).step(0.0001);
// effectComposer.addPass(unrealBloomPass);

var clock = new THREE.Clock();

const tick = () => {
  // Update controls
  controls.update();

  const elapsedTime = clock.getElapsedTime();
  cloudMesh.rotation.y = elapsedTime * 0.01;

  earthMesh.rotation.y = elapsedTime * 0.02;

  // nightMaterial.uniforms.uLightPosition.value = directionalLight.position;

  // Render
  renderer.render(scene, camera);
  // effectComposer.render();

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
