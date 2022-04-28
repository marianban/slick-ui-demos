import * as THREE from 'three';
import { Pane } from 'tweakpane';
import fragment from './fragment.glsl';
import vertex from './vertex.glsl';

const params = {
  progress: 0,
};

const pane = new Pane();
pane.addInput(params, 'progress', { min: 0, max: 1, step: 0.01 });

const cameraAspect = window.innerWidth / window.innerHeight;

const scene = new THREE.Scene();
// const fov = 75;
const halfHeight = window.innerHeight / 2;
const fov = Math.atan(halfHeight / 600) * (360 / (Math.PI * 2)) * 2;
console.log({ fov });
const camera = new THREE.PerspectiveCamera(fov, cameraAspect, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const texture1 = new THREE.TextureLoader().load(
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2940&q=80'
);
const texture2 = new THREE.TextureLoader().load(
  'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80'
);

const geometry = new THREE.PlaneGeometry(400, 400, 400, 400);

let material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
material = new THREE.ShaderMaterial({
  vertexShader: vertex,
  fragmentShader: fragment,
  uniforms: {
    uTexture1: { value: texture1 },
    uTexture2: { value: texture2 },
    uProgress: { value: params.progress },
  },
});
const mesh = new THREE.Points(geometry, material);

function mix(value1, value2, t) {
  const min = Math.min(value1, value2);
  const max = Math.max(value1, value2);
  const delta = max - min;
  return min + delta * t;
}

function setScale() {
  if (!texture1.source.data || !texture2.source.data) {
    return;
  }

  const textureAspect1 =
    texture1.source.data.width / texture1.source.data.height;
  const textureAspect2 =
    texture2.source.data.width / texture2.source.data.height;

  // const imageAspect = 350 / 900;
  // let scaleX = 1;
  // let scaleY = 1;

  let scaleX = mix(textureAspect1, textureAspect2, params.progress);

  // if (textureAspect1 < imageAspect) {
  //   // scaleX = mix(textureAspect1, textureAspect2, params.progress);
  //   scaleX = textureAspect1 * (1 / imageAspect);
  //   scaleY = 1 / imageAspect;
  // } else {
  //   // scaleX = mix(textureAspect1, textureAspect2, params.progress);
  //   scaleX = textureAspect1 * imageAspect;
  //   scaleY = imageAspect;
  // }

  mesh.scale.setX(scaleX);
  // mesh.scale.setY(scaleY);

  // if (cameraAspect < textureAspect) {
  //   mesh.scale.setX(cameraAspect / textureAspect);
  //   mesh.scale.setY(1);
  // } else {
  //   mesh.scale.setX(1);
  //   mesh.scale.setY(textureAspect / cameraAspect);
  // }
}

scene.add(mesh);

camera.position.z = 600;

function animate() {
  mesh.material.uniforms.uProgress.value = params.progress;
  setScale();

  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
