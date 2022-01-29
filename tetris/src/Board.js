import * as THREE from 'three';
import vertex from './board-vertex-shader.glsl';
import fragment from './board-fragment-shader.glsl';

export class Board extends THREE.Object3D {
  constructor({ rows, cols, boxSize, viewWidth, viewHeight }) {
    super();

    this.rows = rows;
    this.cols = cols;
    this.boxSize = boxSize;
    viewWidth = viewWidth + boxSize;
    this.yOffset = -viewHeight / 2;
    this.xOffset = -viewWidth / 2 + boxSize * 0.5;

    const geometry = new THREE.PlaneBufferGeometry(viewWidth, viewHeight);
    const boardBgColor = new THREE.Color('#333333');
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uBoardBgColor: { value: boardBgColor },
        uRows: { value: this.rows },
        uCols: { value: this.cols },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
      // depthWrite: false,
    });
    const planeMesh = new THREE.Mesh(geometry, material);
    planeMesh.position.z = -this.boxSize; // -this.boxSize * 2; //this.boxSize * 2.15;
    this.add(planeMesh);
  }
}
