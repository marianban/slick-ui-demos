import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import * as dat from 'three/examples/jsm/libs/dat.gui.module.js';
// import { Sky } from 'three/examples/jsm/objects/Sky.js';
import smoke2url from './particlePack_1/PNG (Transparent)/smoke_01.png';
import groundColor from './GroundForest003/REGULAR/3K/GroundForest003_COL_VAR1_3K.jpg';
import groundDisp from './GroundForest003/REGULAR/3K/GroundForest003_DISP_3K.jpg';
import groundGloss from './GroundForest003/REGULAR/3K/GroundForest003_GLOSS_3K.jpg';
import groundNormal from './GroundForest003/REGULAR/3K/GroundForest003_NRM_3K.jpg';
import groundReflect from './GroundForest003/REGULAR/3K/GroundForest003_REFL_3K.jpg';
import { BackSide } from 'three';

let scene,
  camera,
  renderer,
  sizes,
  controls,
  material,
  mesh,
  stats,
  sky,
  skyMaterial;

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

  scene.background = new THREE.Color(0xcce0ff);
  scene.fog = new THREE.Fog(0xcce0ff, 30, 500);

  /**
   * Textures
   */
  const textureLoader = new THREE.TextureLoader();

  const smoke2 = textureLoader.load(smoke2url);

  const groundColorTex = textureLoader.load(groundColor);
  repeatTexture(groundColorTex);
  const groundDispTex = textureLoader.load(groundDisp);
  repeatTexture(groundDispTex);
  const groundGlossTex = textureLoader.load(groundGloss);
  repeatTexture(groundGlossTex);
  const groundReflectTex = textureLoader.load(groundReflect);
  repeatTexture(groundReflectTex);
  const groundNormalTex = textureLoader.load(groundNormal);
  repeatTexture(groundNormalTex);

  function repeatTexture(texture) {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(400, 400);
  }

  /**
   * Axes Helper
   */
  const axesHelper = new THREE.AxesHelper(4);
  scene.add(axesHelper);

  /**
   * Cameras
   */
  camera = new THREE.PerspectiveCamera(75, sizes.aspect, 0.01, 1000);
  camera.position.z = 50;
  camera.position.y = 5;
  // camera.rotation.set('x', -Math.PI);
  // camera.position.x = 50;
  scene.add(camera);

  /**
   * Lights
   */
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
  scene.add(directionalLight);

  /**
   * Sky
   */
  // const sky = new Sky();
  // sky.scale.setScalar(450000);
  // scene.add(sky);

  /**
   * Tornado
   */

  const parameters = {
    count: 5_000,
    radius: 5,
    height: 60,
    curviness: 7,
    range: 2,
    particleSize: 300,
    curvinessChangeRate: 1,
  };

  const geometry = new THREE.BufferGeometry();

  const positions = new Float32Array(parameters.count * 3);
  const particleSizes = new Float32Array(parameters.count);

  const largeSizes = [4, 6, 8, 10, 12, 14, 16, 32, 48];
  const smallSizes = [1, 2, 4];

  for (let i = 0; i < parameters.count; i++) {
    const ix = i * 3;
    const iy = ix + 1;
    const iz = iy + 1;
    const angle = Math.random() * Math.PI * 2;
    const y = parameters.height * (i / parameters.count);
    const radius =
      (parameters.radius + 0.015 * Math.max(0, i - parameters.count * 0.8)) *
      (i / parameters.count);
    positions[ix] = Math.sin(angle) * (radius + Math.random() * radius);
    positions[iy] = y;
    positions[iz] = Math.cos(angle) * (radius + Math.random() * radius);
    particleSizes[i] =
      smallSizes[Math.floor(smallSizes.length * Math.random())];
    if (i > parameters.count * 0.8) {
      particleSizes[i] =
        largeSizes[Math.floor(largeSizes.length * Math.random())];
    }
  }

  geometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positions.reverse(), 3)
  );
  geometry.setAttribute(
    'size',
    new THREE.BufferAttribute(particleSizes.reverse(), 1)
  );

  material = new THREE.ShaderMaterial({
    depthWrite: false,
    transparent: true,
    side: THREE.FrontSide,
    uniforms: {
      uSize: { value: parameters.particleSize },
      uPixelRatio: { value: sizes.pixelRatio },
      uTime: { value: 0 },
      uSpeed: { value: 10 },
      uHeight: { value: parameters.height },
      uCurviness: { value: parameters.curviness },
      uCurvinessChangeRate: { value: parameters.curvinessChangeRate },
      uRange: { value: parameters.range },
      uTexture: { value: smoke2 },
    },
    vertexShader: `
      attribute float size;

      uniform float uSize;
      uniform float uTime;
      uniform float uSpeed;
      uniform float uHeight;
      uniform float uCurviness;
      uniform float uCurvinessChangeRate;
      uniform float uRange;
      uniform float uPixelRatio;

      varying vec4 vNormal;
      varying vec2 vUv;

      void main() {

        vec4 modelPosition = modelMatrix * vec4(position, 1.0);
        float angle = atan(modelPosition.x, modelPosition.z);
        float distanceToCenter = length(modelPosition.xz);
        float speed = 1.0 - (modelPosition.y / uHeight);
        modelPosition.x = sin(angle + uTime * speed * uSpeed) * distanceToCenter;
        modelPosition.x = modelPosition.x + sin(uTime * uCurvinessChangeRate + (modelPosition.y / uCurviness)) * uRange;
        modelPosition.z = cos(angle + uTime * speed * uSpeed) * distanceToCenter;
        modelPosition.z = modelPosition.z + cos(uTime * uCurvinessChangeRate + (modelPosition.y / uCurviness)) * uRange;
        vec4 viewPosition = viewMatrix * modelPosition;
        vec4 projectedPosition = projectionMatrix * viewPosition;

        vNormal = vec4(normal, 1.0);
        gl_Position = projectedPosition;
        gl_PointSize = size * uSize * uPixelRatio;
        gl_PointSize *= (1.0 / - viewPosition.z);
      }
    `,
    fragmentShader: `
      varying vec4 vNormal;
      uniform sampler2D uTexture;

      void main() {
        vec2 uv = (vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
        vec4 textureColor = texture2D(uTexture, uv);
        gl_FragColor = textureColor;
      }
    `,
  });

  gui.add(parameters, 'count').min(100).max(1_000_000).step(100);
  gui.add(parameters, 'radius').min(1).max(100).step(0.1);
  gui.add(parameters, 'height').min(1).max(100).step(0.1);
  // gui.add(material.uniforms.uHeight, 'value').min(1).max(100).step(0.1).name('');
  gui
    .add(material.uniforms.uCurviness, 'value')
    .min(0)
    .max(21)
    .step(0.1)
    .name('curviness');
  gui
    .add(material.uniforms.uCurvinessChangeRate, 'value')
    .min(0)
    .max(10)
    .step(0.001)
    .name('curviness rate change');
  gui
    .add(material.uniforms.uRange, 'value')
    .min(0)
    .max(10)
    .step(0.1)
    .name('range');
  gui
    .add(material.uniforms.uSize, 'value')
    .min(1)
    .max(5000)
    .step(0.1)
    .name('size');
  gui
    .add(material.uniforms.uSpeed, 'value')
    .min(1)
    .max(100)
    .step(0.1)
    .name('speed');

  mesh = new THREE.Points(geometry, material);

  mesh.scale.set(1, 1, 1);

  scene.add(mesh);

  /**
   * Ground
   */

  const groundSize = 10000;
  const groundSegments = 5000;
  const groundGeometry = new THREE.PlaneGeometry(
    groundSize,
    groundSize,
    groundSegments,
    groundSegments
  );
  const groundMaterial = new THREE.MeshStandardMaterial({
    color: '#69b581',
    map: groundColorTex,
    // displacementMap: groundDispTex,
    // displacementScale: 6,
  });
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI * 0.5;
  ground.position.y = -0.8;
  scene.add(ground);

  /**
   * Sky
   */
  const skySize = 1000;
  const skyGeometry = new THREE.PlaneGeometry(skySize, skySize, 1);

  // https://www.shadertoy.com/view/XsX3zB
  skyMaterial = new THREE.ShaderMaterial({
    // color: '#B7B1AF',
    side: BackSide,
    transparent: true,
    uniforms: {
      uTime: { value: 0 },
    },
    vertexShader: `
      uniform float uTime;
      varying vec2 vUv;
      varying float vTime;
      void main() {
        vec4 modelPosition = modelMatrix * vec4(position, 1.0);
        vec4 viewPosition = viewMatrix * modelPosition;
        vec4 projectedPosition = projectionMatrix * viewPosition;
        gl_Position = projectedPosition;
        vUv = uv;
        vTime = uTime;
      }
    `,
    fragmentShader: `
    varying float vTime;
    /* discontinuous pseudorandom uniformly distributed in [-0.5, +0.5]^3 */
    vec3 random3(vec3 c) {
      float j = 4096.0*sin(dot(c,vec3(17.0, 59.4, 15.0)));
      vec3 r;
      r.z = fract(512.0*j);
      j *= .125;
      r.x = fract(512.0*j);
      j *= .125;
      r.y = fract(512.0*j);
      return r-0.5;
    }

    /* skew constants for 3d simplex functions */
    const float F3 =  0.3333333;
    const float G3 =  0.1666667;

    /* 3d simplex noise */
    float simplex3d(vec3 p) {
       /* 1. find current tetrahedron T and it's four vertices */
       /* s, s+i1, s+i2, s+1.0 - absolute skewed (integer) coordinates of T vertices */
       /* x, x1, x2, x3 - unskewed coordinates of p relative to each of T vertices*/

       /* calculate s and x */
       vec3 s = floor(p + dot(p, vec3(F3)));
       vec3 x = p - s + dot(s, vec3(G3));

       /* calculate i1 and i2 */
       vec3 e = step(vec3(0.0), x - x.yzx);
       vec3 i1 = e*(1.0 - e.zxy);
       vec3 i2 = 1.0 - e.zxy*(1.0 - e);

       /* x1, x2, x3 */
       vec3 x1 = x - i1 + G3;
       vec3 x2 = x - i2 + 2.0*G3;
       vec3 x3 = x - 1.0 + 3.0*G3;

       /* 2. find four surflets and store them in d */
       vec4 w, d;

       /* calculate surflet weights */
       w.x = dot(x, x);
       w.y = dot(x1, x1);
       w.z = dot(x2, x2);
       w.w = dot(x3, x3);

       /* w fades from 0.6 at the center of the surflet to 0.0 at the margin */
       w = max(0.6 - w, 0.0);

       /* calculate surflet components */
       d.x = dot(random3(s), x);
       d.y = dot(random3(s + i1), x1);
       d.z = dot(random3(s + i2), x2);
       d.w = dot(random3(s + 1.0), x3);

       /* multiply d by w^4 */
       w *= w;
       w *= w;
       d *= w;

       /* 3. return the sum of the four surflets */
       return dot(d, vec4(52.0));
    }

    /* const matrices for 3d rotation */
    const mat3 rot1 = mat3(-0.37, 0.36, 0.85,-0.14,-0.93, 0.34,0.92, 0.01,0.4);
    const mat3 rot2 = mat3(-0.55,-0.39, 0.74, 0.33,-0.91,-0.24,0.77, 0.12,0.63);
    const mat3 rot3 = mat3(-0.71, 0.52,-0.47,-0.08,-0.72,-0.68,-0.7,-0.45,0.56);

    float simplex3d_fractal(vec3 m) {
      return 0.5333333*simplex3d(m*rot1 + vTime * 0.1)
        +0.2666667*simplex3d(2.0*m*rot2)
        +0.1333333*simplex3d(4.0*m*rot3 + vTime)
        +0.0666667*simplex3d(8.0*m + vTime * 0.5);
    }

    varying vec2 vUv;

    void main() {
      vec2 p = vUv * 20.0;
      vec3 p3 = vec3(p, 0.9);
      float value = simplex3d_fractal(p3*8.0+8.0);
      value = 0.5 + 0.5*value;
      value *= smoothstep(0.0, 0.005, abs(0.6-p.x));
      float dist = abs(distance(vUv * 2.0, vec2(1.0)));
      gl_FragColor = vec4(vec3(value), 1.0 - dist);
    }
    `,
  });
  sky = new THREE.Mesh(skyGeometry, skyMaterial);
  sky.rotation.x = -Math.PI * 0.5;
  sky.position.y = parameters.height + 5;
  scene.add(sky);

  /**
   * Renderer
   */

  renderer = new THREE.WebGLRenderer({
    antialias: sizes.pixelRatio < 1.5,
  });
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.5;

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(sizes.pixelRatio);
  document.body.appendChild(renderer.domElement);

  /**
   * Controls
   */
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.screenSpacePanning = false;
  controls.minDistance = 5;
  controls.maxDistance = 100;
  controls.target = new THREE.Vector3(0, 20, 0);
  // controls.maxPolarAngle = Math.PI / 2;

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
}

const clock = new THREE.Clock();

function render() {
  stats.begin();

  controls.update();

  const elapsedTime = clock.getElapsedTime();

  material.uniforms.uTime.value = elapsedTime;
  skyMaterial.uniforms.uTime.value = elapsedTime;

  sky.rotation.z = elapsedTime / 40.0;

  renderer.render(scene, camera);

  requestAnimationFrame(render);

  stats.end();
}

init();
