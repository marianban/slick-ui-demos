import * as THREE from 'three';
import matcap from './matcap.png';
import { clamp } from './utils';

export class Box extends THREE.Object3D {
  constructor({ x, y, size, xOffset, yOffset, color }) {
    super();

    this.size = size;
    this.xOffset = xOffset;
    this.yOffset = yOffset;
    this.color = color;
    this.setPosition(x, y);
    this.initMesh();
  }

  initMesh = () => {
    const bevel = this.size * 0.1;
    const innerSize = this.size - bevel * 1.5;

    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(0, innerSize);
    shape.lineTo(innerSize, innerSize);
    shape.lineTo(innerSize, 0);
    shape.lineTo(0, 0);

    const extrudeSettings = {
      steps: 1,
      depth: innerSize,
      bevelEnabled: true,
      bevelThickness: bevel,
      bevelSize: bevel,
      bevelOffset: 0,
      bevelSegments: 1,
    };

    let geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geometry.center();

    const textureLoader = new THREE.TextureLoader();
    const matcapTexture = textureLoader.load(`static/${matcap}`);

    const color = new THREE.Color(this.color);
    color.convertLinearToSRGB();

    const material = new THREE.MeshMatcapMaterial({ color });
    material.matcap = matcapTexture;

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.z = -0.5;

    this.add(mesh);
  };

  nextMoveDown = () => {
    return { y: this.y - 1, x: this.x };
  };

  nextMoveLeft = () => {
    return { y: this.y, x: this.x - 1 };
  };

  nextMoveRight = () => {
    return { y: this.y, x: this.x + 1 };
  };

  setPosition = (x, y) => {
    this.x = x;
    this.y = y;
    this.position.x = this.xOffset + this.x * this.size;
    this.position.y = this.yOffset + this.y * this.size;
  };
}
