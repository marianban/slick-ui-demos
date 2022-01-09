import * as THREE from 'three';
import matcap from './matcap.png';
import { clamp } from './utils';

export class Box extends THREE.Object3D {
  constructor({ x, y, size, xOffset, yOffset, color, _x, _y }) {
    super();

    this.x = x;
    this.y = y;
    this._x = _x;
    this._y = _y;
    this.size = size;
    this.xOffset = xOffset;
    this.yOffset = yOffset;
    this.color = color;
    this.updatePosition();
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

  moveDown = () => {
    this.y--;
    this.updatePosition();
  };

  moveLeft = () => {
    this.x--;
    this.updatePosition();
  };

  moveRight = () => {
    this.x++;
    this.updatePosition();
  };

  setPosition = (x, y, _x, _y) => {
    this.x = x;
    this.y = y;
    this._x = _x;
    this._y = _y;
    this.updatePosition();
  };

  updatePosition = () => {
    this.position.x = this.xOffset + this.x * this.size;
    this.position.y = this.yOffset + this.y * this.size;
  };
}
