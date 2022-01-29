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
    viewWidth = viewWidth + boxSize;
    this.yOffset = -viewHeight / 2;
    this.xOffset = -viewWidth / 2 + boxSize * 0.5;
    this.time = time;
    this.duration = 2;

    for (let i = 0; i <= rows; i++) {
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
        x: cols + 1,
        y: i,
        size: this.boxSize,
        xOffset: this.xOffset,
        yOffset: this.yOffset,
        color: '#010101',
      });
      this.add(rbox);
    }

    const geometry = new THREE.PlaneBufferGeometry(viewWidth, viewHeight);
    const boardBgColor = new THREE.Color('#333333');
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uBoardBgColor: { value: boardBgColor },
        uRows: { value: this.rows },
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
      // depthWrite: false,
    });
    const planeMesh = new THREE.Mesh(geometry, this.material);
    planeMesh.position.z = -this.boxSize;
    this.add(planeMesh);
  }

  update = (px, py, pw) => {
    this.material.uniforms.uPx.value = px;
    this.material.uniforms.uPy.value = py;
    this.material.uniforms.uPw.value = pw;
    this.material.uniforms.uTime.value = this.time.elapsed;
  };
}
