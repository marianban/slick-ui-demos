import './reset.css';
import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Piece } from './Piece';

class Sketch {
  constructor({ container }) {
    this.container = container;
    this.pixelRatio = Math.max(window.devicePixelRatio, 2);
    this.scene = new THREE.Scene();

    const fov = 45;
    this.camera = new THREE.PerspectiveCamera(
      fov,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    this.camera.position.z = 10;

    const halfFov = (fov / 2) * (Math.PI / 180);
    const opposite = this.camera.position.z * Math.tan(halfFov);
    const viewHeight = opposite * 2;

    const rows = 30;
    const size = viewHeight / rows;

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.physicallyCorrectLights = true;
    this.container.appendChild(this.renderer.domElement);

    const controls = new OrbitControls(this.camera, this.renderer.domElement);

    const field = { width: 30, height: 90 };

    const piece = new Piece({ x: 0, y: 0, size });
    this.scene.add(piece);

    this.render();
  }

  resizeRendererToDisplaySize = () => {
    const size = new THREE.Vector2();
    this.renderer.getSize(size);
    const width = size.x;
    const height = size.y;
    const nextWidth = this.container.clientWidth * this.pixelRatio;
    const nextHeight = this.container.clientHeight * this.pixelRatio;
    const needResize = width !== nextWidth || height !== nextHeight;
    if (needResize) {
      this.renderer.setSize(nextWidth, nextHeight, false);
      this.camera.aspect = nextWidth / nextHeight;
      this.camera.updateProjectionMatrix();
    }
  };

  render = () => {
    this.resizeRendererToDisplaySize();

    this.renderer.render(this.scene, this.camera);

    requestAnimationFrame(this.render);
  };
}

new Sketch({ container: document.querySelector('#container') });
