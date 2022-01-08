import * as THREE from 'three';
import matcap from './matcap.png';

export class Piece extends THREE.Object3D {
  constructor({ x, y, size }) {
    super();

    this.x = x;
    this.y = y;

    const bevel = size * 0.1;
    const innerSize = size - bevel * 1.5;

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

    // geometry = new THREE.BoxBufferGeometry(1, 1, 1);

    // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

    const textureLoader = new THREE.TextureLoader();
    const matcapTexture = textureLoader.load(`static/${matcap}`);

    const color = new THREE.Color('#00ff00');
    color.convertLinearToSRGB();

    const material = new THREE.MeshMatcapMaterial({ color });
    material.matcap = matcapTexture;
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.z = -0.5;
    this.add(mesh);
  }

  moveDown = () => {
    this.y--;
  };
  moveLeft = () => {
    this.x--;
  };
  moveRight = () => {
    this.x++;
  };
}
