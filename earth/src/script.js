import './style.css';
import * as THREE from 'three';
import * as dat from 'dat.gui';
import Stats from 'stats.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  Lensflare,
  LensflareElement,
} from 'three/examples/jsm/objects/Lensflare';

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

const canvas = document.querySelector('canvas.webgl');
const pixelRatio = Math.min(window.devicePixelRatio, 2);

/**
 * Debug
 */
const gui = new dat.GUI({ width: 300 });
const parameters = {
  rotationSpeed: 0.01,
  // relative to rotation
  windSpeed: 0.01,
  c: 0,
  p: 1.35,
};

/**
 * Textures
 */

const backdrop = document.querySelector('.backdrop');

let itemsToLoad = 0;
let loadedItems = 0;

const updateProgress = () => {
  itemsToLoad += 1;
  return () => {
    loadedItems += 1;

    if (loadedItems === itemsToLoad) {
      backdrop.style.opacity = 0;
      backdrop.style.visibility = 'hidden';

      const getFileName = (url) => url.substring(url.lastIndexOf('/') + 1);

      const textureOptions = skyTextures.map((t) => getFileName(t.image.src));
      const textureMap = skyTextures.reduce(
        (acc, t) => ({
          ...acc,
          [getFileName(t.image.src)]: t,
        }),
        {}
      );

      parameters.sky = textureOptions[0];

      earthFolder
        .add(parameters, 'sky')
        .options(textureOptions)
        .onFinishChange((value) => {
          cloudMaterial.map = textureMap[value];
        })
        .name('sky');
    }
  };
};

const textureLoader = new THREE.TextureLoader();

// surface textures
// source https://www.solarsystemscope.com/textures/
const dayTexture = textureLoader.load('/8k_earth_daymap.jpg', updateProgress());
const nightTexture = textureLoader.load(
  '/8k_earth_nightmap.jpg',
  updateProgress()
);
const normalTexture = textureLoader.load(
  '/8k_earth_normal_map.png',
  updateProgress()
);
const specularTexture = textureLoader.load(
  '/8k_earth_specular_map.png',
  updateProgress()
);

// sky textures
// http://www.shadedrelief.com/natural3/pages/clouds.html
const skyTextures = [];
const cloudySkyTexture = textureLoader.load(
  '/europe_clouds_8k.jpg',
  updateProgress()
);
skyTextures.push(cloudySkyTexture);
const stormSkyTexture = textureLoader.load(
  '/storm_clouds_8k.jpg',
  updateProgress()
);
skyTextures.push(stormSkyTexture);

// lens flares
// https://opengameart.org/content/lens-flares-and-particles
const textureFlare0 = textureLoader.load(
  '/lensflare/lensflare0.png',
  updateProgress()
);
const textureFlare2 = textureLoader.load(
  '/lensflare/lensflare2.png',
  updateProgress()
);
const textureFlareHex = textureLoader.load(
  '/lensflare/hexangle.png',
  updateProgress()
);
// http://www.cgchannel.com/2021/01/get-a-free-43200-x-21600px-displacement-map-of-the-earth/
const displacementTexture = textureLoader.load(
  '/EARTH_DISPLACE_8K_16BITS.jpg',
  updateProgress()
);
const cubeTextureLoader = new THREE.CubeTextureLoader();
const environmentMapTexture = cubeTextureLoader.load(
  [
    '/space/px.png',
    '/space/nx.png',
    '/space/py.png',
    '/space/ny.png',
    '/space/pz.png',
    '/space/nz.png',
  ],
  updateProgress()
);

/**
 * Scene
 */

const scene = new THREE.Scene();
scene.background = environmentMapTexture;

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0x99ffff, 1.3);
directionalLight.position.set(800, 0.0, 0);
scene.add(directionalLight);

/**
 * Lensflare
 */
const lensflare = new Lensflare();
lensflare.addElement(
  new LensflareElement(textureFlare0, 700, 0, directionalLight.color)
);
lensflare.addElement(new LensflareElement(textureFlare2, 1200, 0.025));
lensflare.addElement(new LensflareElement(textureFlareHex, 60, 0.6));
lensflare.addElement(new LensflareElement(textureFlareHex, 70, 0.7));
lensflare.addElement(new LensflareElement(textureFlareHex, 120, 0.9));
lensflare.addElement(new LensflareElement(textureFlareHex, 70, 1));
directionalLight.add(lensflare);

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(65, sizes.width / sizes.height);
camera.position.z = 6;
scene.add(camera);

/**
 * Earth
 */
const earth = new THREE.Group();
const earthFolder = gui.addFolder('Earth');

earthFolder
  .add(parameters, 'windSpeed')
  .min(-0.1)
  .max(0.1)
  .step('0.0001')
  .name('wind');
earthFolder
  .add(parameters, 'rotationSpeed')
  .min(0)
  .max(0.1)
  .step('0.0001')
  .name('rotation');

const earthSegments = 500;
const earthGeometry = new THREE.SphereGeometry(2, earthSegments, earthSegments);
const earthMaterial = new THREE.MeshPhongMaterial({
  precision: 'lowp',
  map: dayTexture,
  specularMap: specularTexture,
  specular: new THREE.Color(0x111111),
  shininess: 25,
  normalMap: normalTexture,
  displacementMap: displacementTexture,
  displacementScale: 0.03,
});

earthFolder.add(earthMaterial, 'shininess').min(0).max(100).step(0.01);
earthFolder
  .add(earthMaterial, 'displacementScale')
  .min(0)
  .max(0.1)
  .step(0.0001)
  .name('displacement');

const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
earth.add(earthMesh);

const couldSegments = 200;
const cloudGeometry = new THREE.SphereGeometry(
  2.03,
  couldSegments,
  couldSegments
);
const cloudMaterial = new THREE.MeshPhongMaterial({
  precision: 'lowp',
  map: skyTextures[0],
  side: THREE.DoubleSide,
  opacity: 0.8,
  transparent: true,
  depthWrite: false,
  blending: THREE.CustomBlending,
  blendEquation: THREE.MaxEquation,
});
const cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
earth.add(cloudMesh);

const nightGeometry = new THREE.SphereGeometry(
  2.019,
  couldSegments,
  couldSegments
);

const nightMaterial = new THREE.ShaderMaterial({
  precision: 'lowp',
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
      vec4 viewPosition4 = modelViewMatrix * vec4(position, 1.0);
      vec4 viewLightPosition4 = viewMatrix * vec4(uLightPosition, 1.0);
      vec3 lightDirection = normalize(viewLightPosition4.xyz - viewPosition4.xyz);
      vec3 normalDirection = normalize(normalMatrix * normal);

      gl_Position = projectionMatrix * viewPosition4;

      vAlpha = abs(min(0.0, dot(lightDirection, normalDirection)));
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
earth.add(nightMesh);

parameters.c = 0;
parameters.p = 1.35;
// inspired by http://stemkoski.github.io/Three.js/Shader-Glow.html
const atmosphereMaterial = new THREE.ShaderMaterial({
  precision: 'lowp',
  uniforms: {
    uC: { value: parameters.c },
    uP: { value: parameters.p },
    uColor: { value: new THREE.Color(0x034d8e) },
  },
  vertexShader: `
    uniform float uC;
    uniform float uP;
    varying float vAlpha;
    void main()
    {
        vec4 viewPosition4 = modelViewMatrix * vec4(position, 1.0);
        vec3 viewPosition = viewPosition4.xyz;
        vec4 viewCameraPosition4 = viewMatrix * vec4(cameraPosition, 1.0);
        vec3 cameraDirection = normalize(viewCameraPosition4.xyz - viewPosition);
        vec3 normalDirection = normalize(normalMatrix * normal);
        float intensity = abs(min(0.0, dot(cameraDirection, normalDirection)));
        vAlpha = pow(intensity + uC, uP);
        gl_Position = projectionMatrix * viewPosition4;
    }
  `,
  fragmentShader: `
    uniform vec3 uColor;
    varying float vAlpha;
    void main()
    {
      gl_FragColor = vec4(uColor, vAlpha);
    }
  `,
  side: THREE.BackSide,
  blending: THREE.AdditiveBlending,
  transparent: true,
});
const atmosphereFolder = gui.addFolder('Atmosphere');
atmosphereFolder
  .add(atmosphereMaterial.uniforms.uC, 'value')
  .min(-1)
  .max(1)
  .step(0.0001)
  .name('c');
atmosphereFolder
  .add(atmosphereMaterial.uniforms.uP, 'value')
  .min(0)
  .max(6)
  .step(0.0001)
  .name('p');

const atmosphereGeometry = new THREE.SphereGeometry(2.2, 128, 128);
const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
earth.add(atmosphereMesh);

scene.add(earth);

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

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: pixelRatio < 1.5,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(pixelRatio);
renderer.render(scene, camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

var clock = new THREE.Clock();

const tick = () => {
  stats.begin();

  controls.update();

  // animations
  const elapsedTime = clock.getElapsedTime();

  cloudMesh.rotation.x = Math.sin(elapsedTime * 2 * parameters.windSpeed);
  earth.rotation.y = elapsedTime * parameters.rotationSpeed;

  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);

  stats.end();
};

tick();
