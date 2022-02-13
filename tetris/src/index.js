import './reset.css';
import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Piece } from './Piece';
import { Board } from './Board';
import { Time } from './Time';
import { Score } from './Score';
import { GameState } from './GameState';
import { ShapeQueue } from './ShapeQueue';
import { Bg } from './Bg';

class Sketch {
  constructor({ container }) {
    this.container = container;
    this.boxes = new Set();
    this.time = new Time();

    this.initGameState();
    this.initScene();
    this.initDimensions();
    this.initBg();
    this.initBoard();
    this.initScore();
    this.initShapeQueue();
    this.addPiece();

    this.render();

    window.addEventListener('keydown', this.handleKeyDown);

    window.setInterval(this.gameTick, 1000);
  }

  initGameState = () => {
    this.gameState = new GameState({
      onRestart: this.handleStartGame,
      onStart: this.handleStartGame,
    });
  };

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

  initDimensions = () => {
    const halfFov = (this.camera.fov / 2) * (Math.PI / 180);
    const opposite = this.camera.position.z * Math.tan(halfFov);
    const viewHeight = opposite * 2;
    this.viewHeight = viewHeight;
  };

  initBg = () => {
    this.bg = new Bg({
      time: this.time,
      viewHeight: this.viewHeight,
      viewWidth: this.camera.aspect * this.viewHeight,
    });
    this.scene.add(this.bg);
  };

  initBoard = () => {
    const rows = 30;
    const cols = 10;
    const boxSize = this.viewHeight / rows;
    const viewWidth = cols * boxSize;

    this.board = new Board({
      rows: rows - 1,
      cols,
      boxSize,
      viewWidth,
      viewHeight: this.viewHeight,
      time: this.time,
    });

    this.scene.add(this.board);
  };

  initScore = () => {
    this.score = new Score({
      yOffset: this.board.yOffset,
      xOffset: this.board.xOffset,
      boxSize: this.board.boxSize,
      viewHeight: this.board.viewHeight,
      aspect: this.camera.aspect,
    });
    this.scene.add(this.score);
  };

  initShapeQueue = () => {
    this.shapeQueue = new ShapeQueue({
      yOffset: this.board.yOffset,
      xOffset: this.board.xOffset,
      cols: this.board.cols,
      boxSize: this.board.boxSize,
      viewHeight: this.board.viewHeight,
      rows: this.board.rows,
      aspect: this.camera.aspect,
      time: this.time,
    });
    this.scene.add(this.shapeQueue);
  };

  addPiece = () => {
    const [shape, color] = this.shapeQueue.getNextShape();
    const maxX = Math.max(...shape.positions.map((p) => p.x));
    this.piece = new Piece({
      x: Math.round(Math.random() * (this.board.cols - maxX)),
      y: this.board.rows,
      yOffset: this.board.yOffset,
      xOffset: this.board.xOffset,
      size: this.board.boxSize,
      shape,
      color,
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
    if (this.gameState.isPaused()) {
      return;
    }

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

  handleStartGame = () => {
    this.score.resetScore();
    const boxes = [...this.boxes];
    for (const box of boxes) {
      box.removeBox();
      this.boxes.delete(box);
    }
    this.piece.removeFromParent();
    this.addPiece();
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

  checkGameEnd = () => {
    const boxes = [...this.boxes];
    const lastRowElements = boxes.filter((b) => b.y === this.board.rows);
    if (lastRowElements.length) {
      this.gameState.over();
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
        break;
      }

      if (position.y < 0) {
        isValid = false;
        break;
      }

      for (const box of this.boxes) {
        if (box.x === position.x && box.y === position.y) {
          isValid = false;
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
      this.initDimensions();
      this.bg.removeFromParent();
      this.bg.dispose();
      this.initBg();
      this.score.updatePosition(aspect);
      this.shapeQueue.updatePosition(aspect);
      this.camera.updateProjectionMatrix();
    }
  };

  render = () => {
    this.resizeRendererToDisplaySize();
    this.checkGameEnd();

    this.board.render(this.piece.x, this.piece.y, this.piece.width);
    this.score.render();
    this.gameState.render();
    this.shapeQueue.render();
    this.bg.render();

    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.render);
  };
}

new Sketch({ container: document.querySelector('#container') });
