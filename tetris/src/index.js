import './reset.css';
import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Piece } from './Piece';

class Sketch {
  constructor({ container }) {
    this.container = container;

    this.initScene();
    this.initBoard();
    this.addPiece();
    this.render();

    window.addEventListener('keydown', this.handleKeyDown);
  }

  initScene = () => {
    this.pixelRatio = Math.max(window.devicePixelRatio, 2);
    this.scene = new THREE.Scene();

    const fov = 45;
    this.camera = new THREE.PerspectiveCamera(
      fov,
      this.container.clientWidth / this.container.clientHeight,
      0.1,
      1000
    );
    this.camera.position.z = 10;

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.physicallyCorrectLights = true;
    this.container.appendChild(this.renderer.domElement);

    const controls = new OrbitControls(this.camera, this.renderer.domElement);
  };

  initBoard = () => {
    const halfFov = (this.camera.fov / 2) * (Math.PI / 180);
    const opposite = this.camera.position.z * Math.tan(halfFov);
    const viewHeight = opposite * 2;

    const rows = 30;
    const cols = 10;
    const boxSize = viewHeight / rows;
    this.board = {
      rows,
      cols,
      boxSize,
      yOffset: -viewHeight / 2,
      xOffset: -(cols * boxSize) / 2,
    };
  };

  addPiece = () => {
    this.piece = new Piece({
      x: Math.round(Math.random() * this.board.cols),
      y: this.board.rows,
      yOffset: this.board.yOffset,
      xOffset: this.board.xOffset,
      size: this.board.boxSize,
      maxX: this.board.cols,
      maxY: this.board.rows,
    });
    this.scene.add(this.piece);
  };

  handleKeyDown = (event) => {
    switch (event.code) {
      case 'ArrowUp':
        this.piece.rotateRight();
        break;
      case 'ArrowDown':
        this.piece.moveDown();
        break;
      case 'ArrowLeft':
        this.piece.moveLeft();
        break;
      case 'ArrowRight':
        this.piece.moveRight();
        break;
    }
  };

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
