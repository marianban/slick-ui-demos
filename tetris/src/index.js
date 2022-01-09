import './reset.css';
import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Piece } from './Piece';
import { shapes } from './constants';

class Sketch {
  constructor({ container }) {
    this.container = container;
    this.boxes = [];

    this.initScene();
    this.initBoard();
    this.addPiece();
    this.render();

    window.addEventListener('keydown', this.handleKeyDown);

    window.setInterval(this.gameTick, 1000);
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
    let shape = shapes[Math.floor(shapes.length * Math.random())];
    // shape = shapes.find((s) => s.name === 'T');
    const maxX = Math.max.apply(
      Math,
      shape.positions.map((p) => p.x)
    );
    this.piece = new Piece({
      x: Math.round(Math.random() * (this.board.cols - maxX)),
      y: this.board.rows,
      yOffset: this.board.yOffset,
      xOffset: this.board.xOffset,
      size: this.board.boxSize,
      shape,
    });
    this.scene.add(this.piece);
  };

  handleKeyDown = (event) => {
    switch (event.code) {
      case 'ArrowUp':
        this.rotatePiece();
      case 'ArrowDown':
        this.movePieceDown();
        break;
      case 'ArrowLeft':
        this.movePieceLeft();
        break;
      case 'ArrowRight':
        this.movePieceRight();
        break;
    }
  };

  gameTick = () => {
    this.movePieceDown();
  };

  movePieceDown = () => {
    const nextPositions = this.piece.nextMoveDown();
    if (this.isValidMove(nextPositions)) {
      this.piece.applyPositions(nextPositions);
    } else {
      this.boxes.push(...this.piece.boxes);
      this.addPiece();
    }
  };

  movePieceLeft = () => {
    const nextPositions = this.piece.nextMoveLeft();
    if (this.isValidMove(nextPositions)) {
      this.piece.applyPositions(nextPositions);
    }
  };

  movePieceRight = () => {
    const nextPositions = this.piece.nextMoveRight();
    if (this.isValidMove(nextPositions)) {
      this.piece.applyPositions(nextPositions);
    }
  };

  rotatePiece = () => {
    const nextPositions = this.piece.nextRotation();
    if (this.isValidMove(nextPositions)) {
      this.piece.applyPositions(nextPositions);
    }
  };

  isValidMove = (positions) => {
    let isValid = true;

    loop: for (const position of positions) {
      if (position.x < 0 || position.x > this.board.cols) {
        isValid = false;
        console.log('outside colls', position);
        break;
      }

      if (position.y < 0) {
        isValid = false;
        console.log('down');
        break;
      }

      for (const box of this.boxes) {
        if (box.x === position.x && box.y === position.y) {
          isValid = false;
          console.log('collision');
          break loop;
        }
      }
    }

    return isValid;
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
