import './reset.css';
import './style.css';
import * as THREE from 'three';

class Sketch {
  constructor({ container }) {
    this.container = container;
    this.pixelRatio = Math.max(window.devicePixelRatio, 2);
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    this.camera.position.z = 10;

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.physicallyCorrectLights = true;
    this.container.appendChild(this.renderer.domElement);

    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
    const material = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#44aa88').convertSRGBToLinear(),
    });
    const cube = new THREE.Mesh(geometry, material);
    this.scene.add(cube);

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
