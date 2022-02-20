import * as THREE from 'three';
import vertex from './board-vertex-shader.glsl';
import fragment from './board-fragment-shader.glsl';
import { Box } from './Box';

export class Board extends THREE.Object3D {
  constructor({ rows, cols, boxSize, viewWidth, viewHeight, time }) {
    super();

    this.rows = rows;
    this.cols = cols;
    this.boxSize = boxSize;
    this.viewHeight = viewHeight;
    viewWidth = viewWidth + boxSize;
    this.viewWidth = viewWidth;
    this.yOffset = -viewHeight / 2;
    this.xOffset = -viewWidth / 2 + boxSize * 0.5;
    this.time = time;
    this.duration = 2;

    this.initBorders();

    const geometry = new THREE.PlaneBufferGeometry(
      viewWidth,
      viewHeight + boxSize * 2
    );
    const boardBgColor = new THREE.Color('#181819');
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uBoardBgColor: { value: boardBgColor },
        uRows: { value: this.rows + 2 },
        uCols: { value: this.cols },
        uPx: {
          value: 0,
        },
        uPy: {
          value: 0,
        },
        uPw: {
          value: 0,
        },
        uTime: {
          value: 0,
        },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
    });
    const planeMesh = new THREE.Mesh(geometry, this.material);
    planeMesh.position.z = -this.boxSize;
    this.add(planeMesh);
  }

  initBorders = () => {
    for (let i = 0; i <= this.rows; i++) {
      const lbox = new Box({
        x: -1,
        y: i,
        size: this.boxSize,
        xOffset: this.xOffset,
        yOffset: this.yOffset,
        color: '#010101',
      });
      this.add(lbox);
      const rbox = new Box({
        x: this.cols + 1,
        y: i,
        size: this.boxSize,
        xOffset: this.xOffset,
        yOffset: this.yOffset,
        color: '#010101',
      });
      this.add(rbox);
    }

    for (let i = 0; i <= this.cols; i++) {
      const bbox = new Box({
        x: i,
        y: -1,
        size: this.boxSize,
        xOffset: this.xOffset,
        yOffset: this.yOffset,
        color: '#010101',
      });
      this.add(bbox);
    }
  };

  render = (px, py, pw) => {
    this.material.uniforms.uPx.value = px;
    this.material.uniforms.uPy.value = py;
    this.material.uniforms.uPw.value = pw;
    this.material.uniforms.uTime.value = this.time.elapsed;
  };

  get totalWidth() {
    const totalWidth = (this.cols + 7 * 2) * this.boxSize + this.boxSize;
    const pxRatio = window.innerHeight / this.viewHeight;
    return pxRatio * totalWidth;
  }
}
