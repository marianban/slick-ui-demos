import * as THREE from 'three';
import { Pane } from 'tweakpane';
import fragment from './fragment.glsl';
import vertex from './vertex.glsl';
import { imageUrls } from './images';
import ImagePreloader from 'image-preloader';
import { gsap } from 'gsap';
import { computeScale } from './utils';

const loaderContainer = document.querySelector('.loader-container');

let images = [];
var preloader = new ImagePreloader();
preloader.preload(...imageUrls).then(function (loadedImages) {
  images = loadedImages.map((x) => {
    x.value.crossOrigin = 'Anonymous';
    return x.value;
  });
  scene();
  loaderContainer.remove();
});

function scene() {
  let imageIndex = 1;

  const params = {
    progress: 0,
  };

  const pane = new Pane();
  pane.addInput(params, 'progress', { min: 0, max: 1, step: 0.01 });

  const scene = new THREE.Scene();
  const cameraAspect = window.innerWidth / window.innerHeight;
  const initialWidth = window.innerWidth;
  const initialHeight = window.innerHeight;
  const halfHeight = window.innerHeight / 2;
  const fov = Math.atan(halfHeight / 600) * (360 / (Math.PI * 2)) * 2;
  const camera = new THREE.PerspectiveCamera(fov, cameraAspect, 590, 610);

  const renderer = new THREE.WebGLRenderer({
    powerPreference: 'high-performance',
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  // for better performance
  let pixelRatio = window.devicePixelRatio;
  renderer.setPixelRatio(pixelRatio);
  renderer.setClearColor('#111111');
  document.body.appendChild(renderer.domElement);

  let texture1 = new THREE.Texture(images[imageIndex - 1]);
  texture1.needsUpdate = true;
  let texture2 = new THREE.Texture(images[imageIndex]);
  texture2.needsUpdate = true;

  const uPixelSize = 1;
  // const initialVMin = Math.min(window.innerWidth, window.innerHeight);
  const geometry = new THREE.PlaneGeometry(
    window.innerWidth,
    window.innerHeight
  );

  let material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  material = new THREE.ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    uniforms: {
      uTime: { value: 0 },
      uPixelRatio: { value: pixelRatio },
      uTexture1: { value: texture1 },
      uTexture2: { value: texture2 },
      uProgress: { value: params.progress },
      uProgressMix: { value: params.progress },
      uAspectRatio: { value: 0 },
      uPixelSize: { value: uPixelSize },
      uScreenSize: {
        value: new THREE.Vector2(window.innerWidth, window.innerHeight),
      },
    },
  });
  const mesh = new THREE.Mesh(geometry, material);

  window.mesh = mesh;

  function mix(value1, value2, t) {
    const min = Math.min(value1, value2);
    const max = Math.max(value1, value2);
    const delta = max - min;
    const newT = min === value1 ? t : 1 - t;
    return delta * newT + min;
  }

  function setScale(progress) {
    if (!texture1.source.data || !texture2.source.data) {
      return;
    }

    let textureWidth = mix(
      texture1.source.data.width,
      texture2.source.data.width,
      progress
    );
    let textureHeight = mix(
      texture1.source.data.height,
      texture2.source.data.height,
      progress
    );

    const { scaleX, scaleY } = computeScale({
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      initialWindowWidth: initialWidth,
      initialWindowHeight: initialHeight,
      initialTextureWidth: textureWidth,
      initialTextureHeight: textureHeight,
    });

    mesh.scale.setX(scaleX);
    mesh.scale.setY(scaleY);
  }

  scene.add(mesh);

  camera.position.z = 600;

  let time = 0;
  let lastTime = Date.now();

  function animate() {
    const progress = Math.sin(Math.PI * params.progress);

    mesh.material.uniforms.uProgress.value = progress;
    mesh.material.uniforms.uProgressMix.value = params.progress;
    mesh.material.uniforms.uTime.value = time;

    const now = Date.now();
    const delta = (now - lastTime) / 1000;
    time += delta;

    setScale(params.progress);

    requestAnimationFrame(animate);

    renderer.render(scene, camera);
    lastTime = now;
  }
  animate();

  let animation;

  window.addEventListener('click', handleClick.bind(this));
  window.addEventListener('touchend', handleClick.bind(this));

  function handleClick() {
    imageIndex++;

    if (animation && animation.progress() < 1) {
      animation.progress(1).kill();
      imageIndex++;
    }

    animation = gsap.to(params, {
      progress: 1,
      ease: 'slow(0.7,0.7, false)',
      duration: 0.75,
      onComplete: () => {
        const prevTexture = new THREE.Texture(texture2.source.data);
        prevTexture.needsUpdate = true;
        texture1 = prevTexture;
        material.uniforms.uTexture1.value = texture1;

        const nextImage = images[imageIndex % images.length];
        const nextTexture = new THREE.Texture(nextImage);
        nextTexture.needsUpdate = true;
        texture2 = nextTexture;
        material.uniforms.uTexture2.value = nextTexture;

        params.progress = 0;
      },
    });
  }

  window.addEventListener('resize', () => {
    const cameraAspect = window.innerWidth / window.innerHeight;
    const halfHeight = window.innerHeight / 2;
    const fov = Math.atan(halfHeight / 600) * (360 / (Math.PI * 2)) * 2;
    camera.aspect = cameraAspect;
    camera.fov = fov;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
  });
}
