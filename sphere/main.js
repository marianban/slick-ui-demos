import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import * as dat from 'three/examples/jsm/libs/dat.gui.module.js';
import { Noise } from 'noisejs';

let scene,
  camera,
  renderer,
  sizes,
  controls,
  cubeCamera,
  sphereMaterial,
  sphereMesh,
  sphereGroup,
  stats,
  effectComposer;

// https://unsplash.com/photos/XPDXhRy92Oc

function init() {
  const gui = new dat.GUI({ width: 300 });

  stats = new Stats();
  stats.showPanel(0);
  document.body.appendChild(stats.dom);

  sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    get aspect() {
      return this.width / this.height;
    },
    get pixelRatio() {
      return Math.min(window.devicePixelRatio, 2);
    },
  };

  scene = new THREE.Scene();

  /**
   * Textures
   */
  const urls = [
    '/bg3/px.png',
    '/bg3/nx.png',
    '/bg3/py.png',
    '/bg3/ny.png',
    '/bg3/pz.png',
    '/bg3/nz.png',
  ];
  const cubeTextureLoader = new THREE.CubeTextureLoader();
  const background = cubeTextureLoader.load(urls);
  scene.background = background;

  /**
   * Cameras
   */
  camera = new THREE.PerspectiveCamera(85, sizes.aspect, 1, 500);
  camera.position.z = 4;
  scene.add(camera);

  sphereGroup = new THREE.Group();

  const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256, {
    format: THREE.RGBFormat,
    generateMipmaps: false,
    minFilter: THREE.LinearFilter,
  });

  cubeCamera = new THREE.CubeCamera(1, 100, cubeRenderTarget);
  sphereGroup.add(cubeCamera);

  /**
   * Sphere
   */

  const sphereSegments = 500;
  const sphereGeometry = new THREE.SphereBufferGeometry(
    2,
    sphereSegments,
    sphereSegments
  );

  sphereMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uElevation: { value: 0.2 },
      uFrequency: { value: 15.0 },
      uSpeed: { value: 1.0 },
      uCubeMap: { value: cubeCamera.renderTarget.texture },
    },
    vertexShader: `
      uniform float uTime;
      uniform float uElevation;
      uniform float uFrequency;
      uniform float uSpeed;

      varying vec2 vUv;
      varying vec3 vViewVector;
      varying vec3 vNormal;
      varying float vColorScale;

      void main() {

        float timeSpeed = uTime * uSpeed;
        float elevationScale = uElevation * sin(position.x * uFrequency + timeSpeed) * sin(position.y * uFrequency + timeSpeed) * sin(position.z * uFrequency + timeSpeed);

        float elevationValue = smoothstep(-uElevation, uElevation, elevationScale);

        float shiftFreq = uFrequency * 0.5;

        float sideShift = sin(position.y * shiftFreq + uTime) * sin(position.z * shiftFreq + uTime) * uElevation * 0.8;

        vec3 elevationVector = (normalize(normal) * elevationScale) + vec3(sideShift, 0, 0);

        vec4 modelPosition = modelMatrix * vec4(position + elevationVector, 1.0);

        vec4 viewPosition = viewMatrix * modelPosition;
        vec4 projectedPosition = projectionMatrix * viewPosition;

        vViewVector = modelPosition.xyz - cameraPosition;
        vNormal = normal;
        vColorScale = elevationValue;

        gl_Position = projectedPosition;
      }
    `,
    fragmentShader: `
      uniform samplerCube uCubeMap;

      varying vec3 vViewVector;
      varying vec3 vNormal;
      varying float vColorScale;

      void main() {
        vec3 reflectedDirection = normalize(reflect(vViewVector, vNormal));
        reflectedDirection.x = -reflectedDirection.x;

        vec3 textureColor = textureCube(uCubeMap, reflectedDirection).rgb;


        vec3 darkestColor = textureColor * vec3(0.1);
        vec3 lightestColor = textureColor * vec3(1.9);

        vec3 color = mix(darkestColor, lightestColor, vColorScale);

        gl_FragColor = vec4(color, 1.0);
      }
    `,
  });

  gui
    .add(sphereMaterial.uniforms.uElevation, 'value')
    .min(0)
    .max(2)
    .step(0.001)
    .name('elevation');

  gui
    .add(sphereMaterial.uniforms.uFrequency, 'value')
    .min(0)
    .max(100)
    .step(0.001)
    .name('frequency');

  gui
    .add(sphereMaterial.uniforms.uSpeed, 'value')
    .min(0)
    .max(20)
    .step(0.001)
    .name('speed');

  sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);

  sphereMesh.scale.set(1, 1, 1);

  sphereGroup.add(sphereMesh);

  scene.add(sphereGroup);

  /**
   * Renderer
   */

  renderer = new THREE.WebGLRenderer({
    antialias: sizes.pixelRatio < 1.5,
  });

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(sizes.pixelRatio);
  document.body.appendChild(renderer.domElement);

  /**
   * Post processing
   */
  effectComposer = new EffectComposer(renderer);
  effectComposer.setPixelRatio(sizes.pixelRatio);
  effectComposer.setSize(sizes.width, sizes.height);

  const renderPass = new RenderPass(scene, camera);
  effectComposer.addPass(renderPass);

  const unrealBloomPass = new UnrealBloomPass();
  effectComposer.addPass(unrealBloomPass);

  unrealBloomPass.strength = 0.4;
  unrealBloomPass.radius = 1;
  unrealBloomPass.threshold = 0.6;

  var bloomFolder = gui.addFolder('Bloom');
  bloomFolder.add(unrealBloomPass, 'enabled');
  bloomFolder.add(unrealBloomPass, 'strength').min(0).max(2).step(0.001);
  bloomFolder.add(unrealBloomPass, 'radius').min(0).max(2).step(0.001);
  bloomFolder.add(unrealBloomPass, 'threshold').min(0).max(1).step(0.001);

  /**
   * Controls
   */
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  /**
   * Event Listeners
   */
  window.addEventListener('resize', handleWindowResize);

  render();
}

function handleWindowResize() {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.aspect;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(sizes.pixelRatio);

  effectComposer.setSize(sizes.width, sizes.height);
}

const clock = new THREE.Clock();
const noise = new Noise(Math.random());

const speed = 0.1;
const elevation = 0.2;

function render() {
  stats.begin();

  controls.update();

  const elapsedTime = clock.getElapsedTime();

  sphereMaterial.uniforms.uTime.value = elapsedTime;

  cubeCamera.update(renderer, scene);

  const noiseTime = elapsedTime * speed;
  const xNoise = noise.perlin2(noiseTime, noiseTime + 100);
  const yNoise = noise.perlin2(noiseTime + 100, noiseTime + 1000);
  const zNoise = noise.perlin2(noiseTime + 10000, noiseTime + 100000);

  sphereMesh.position.x = xNoise * elevation;
  sphereMesh.position.y = yNoise * elevation;
  sphereMesh.position.z = zNoise * elevation;

  effectComposer.render();

  requestAnimationFrame(render);

  stats.end();
}

init();
