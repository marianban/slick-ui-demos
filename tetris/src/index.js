import './reset.css';
import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Piece } from './Piece';
import { shapes } from './constants';
import { Board } from './Board';
import { Time } from './Time';
import { Score } from './Score';

class Sketch {
  constructor({ container }) {
    this.container = container;
    this.boxes = new Set();
    this.time = new Time();

    this.initScene();
    this.initBoard();
    this.initScore();

    this.addPiece();

    this.render();

    window.addEventListener('keydown', this.handleKeyDown);

    window.setInterval(this.gameTick, 1000);
  }

  initScene = () => {
    this.pixelRatio = Math.max(window.devicePixelRatio, 2);
    this.scene = new THREE.Scene();

    const fov = 13;
    this.camera = new THREE.PerspectiveCamera(
      fov,
      this.container.clientWidth / this.container.clientHeight,
      0.1,
      1000
    );
    this.camera.position.z = 10;

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.physicallyCorrectLights = true;
    this.renderer.setClearColor('#181819');
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
    const viewWidth = cols * boxSize;

    this.board = new Board({
      rows: rows - 1,
      cols,
      boxSize,
      viewWidth,
      viewHeight,
      time: this.time,
    });

    this.scene.add(this.board);
  };

  initScore = () => {
    this.score = new Score({
      xOffset: this.board.xOffset,
      yOffset: this.board.yOffset,
      boxSize: this.board.boxSize,
      viewHeight: this.board.viewHeight,
      aspect: this.camera.aspect,
    });
    this.scene.add(this.score);
  };

  addPiece = () => {
    let shape = shapes[Math.floor(shapes.length * Math.random())];
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
        break;
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
    this.clearCompletedRows();
  };

  movePieceDown = () => {
    const nextPositions = this.piece.nextMoveDown();
    if (this.isValidMove(nextPositions)) {
      this.piece.applyPositions(nextPositions);
    } else {
      for (const box of this.piece.boxes) {
        this.boxes.add(box);
      }
      this.addPiece();
    }
  };

  clearCompletedRows = () => {
    const boxes = [...this.boxes];
    let removedRows = [];

    const removeAnimations = [];
    // remove completed rows
    for (let row = 0; row < this.board.rows; row++) {
      const rowBoxes = boxes.filter((b) => b.y === row);
      if (rowBoxes.length === this.board.cols + 1) {
        removedRows.push(row);
        for (const box of rowBoxes) {
          removeAnimations.push(box.removeBox());
          this.boxes.delete(box);
        }
      }
    }

    this.score.updateScore(removedRows.length);

    Promise.all(removeAnimations).then(() => {
      // fill gaps and shift remaining boxes down
      for (let row = 1; row < this.board.rows; row++) {
        const offset = removedRows.filter((r) => r < row).length;
        const rowBoxes = boxes.filter((b) => b.y === row);
        if (rowBoxes.length) {
          for (const box of rowBoxes) {
            box.setPosition(box.x, box.y - offset);
          }
        }
      }
    });
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
    const maxDimension = this.piece.getMaxDimension();
    const minX = this.board.cols - (maxDimension - 1);
    const delta = this.piece.x - minX;
    if (delta > 0) {
      // in case we are close the right side of the board
      // the rotation may be blocked so we try to move the
      // piece to left before we rotate it
      for (let xShift = 0; xShift <= delta; xShift++) {
        const nextPositions = this.piece.nextRotation(xShift);
        if (this.isValidMove(nextPositions)) {
          this.piece.applyPositions(nextPositions);
          break;
        }
      }
    } else {
      const nextPositions = this.piece.nextRotation();
      if (this.isValidMove(nextPositions)) {
        this.piece.applyPositions(nextPositions);
      }
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
      const aspect = nextWidth / nextHeight;
      this.camera.aspect = aspect;
      this.score.updatePosition(aspect);
      this.camera.updateProjectionMatrix();
    }
  };

  render = () => {
    this.resizeRendererToDisplaySize();
    this.board.update(this.piece.x, this.piece.y, this.piece.width);
    this.score.update();

    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.render);
  };
}

new Sketch({ container: document.querySelector('#container') });
