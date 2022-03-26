import * as THREE from 'three';
import gsap from 'gsap';
import matcap from './matcap6.png';

const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load(`static/${matcap}`);

const materials = {};

export class Box extends THREE.Object3D {
  static geometry;

  constructor({ x, y, size, xOffset, yOffset, color }) {
    super();

    this.size = size;
    this.xOffset = xOffset;
    this.yOffset = yOffset;
    this.color = color;

    this.initGeometry();
    this.initMesh();
    this.setPosition2(x, y);
  }

  initGeometry = () => {
    if (!Box.geometry) {
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

      const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
      geometry.center();

      Box.geometry = geometry;
    }
  };

  initMesh = () => {
    let material;

    if (!materials[this.color]) {
      const color = new THREE.Color(this.color);
      color.convertLinearToSRGB();
      material = new THREE.MeshMatcapMaterial({ color });
      material.matcap = matcapTexture;
      materials[this.color] = material;
    } else {
      material = materials[this.color];
    }

    this.mesh = new THREE.Mesh(Box.geometry, material);
    this.mesh.position.y = +this.size * 0.5;

    this.add(this.mesh);
  };

  nextMoveDown = () => {
    if (Math.floor(this.y) !== Math.ceil(this.y)) {
      return { y: this.y - 0.5, x: this.x };
    } else {
      return { y: this.y - 1, x: this.x };
    }
  };

  nextMoveLeft = () => {
    return { y: this.y, x: this.x - 1 };
  };

  nextMoveRight = () => {
    return { y: this.y, x: this.x + 1 };
  };

  setPosition = (x, y, delay = 0) => {
    if (this.animation && this.animation.progress() < 1) {
      this.animation.progress(1).kill();
      // this.roundPositions();
    }
    this.x = x;
    this.y = y;
    this.animation = gsap.to(this.position, {
      delay,
      duration: 0.2,
      x: this.xOffset + this.x * this.size,
      y: this.yOffset + this.y * this.size,
      ease: 'power2.inOut',
      onComplete: () => {
        // this.roundPositions();
      },
    });
    return this.animation;
  };

  setPosition2 = (x, y) => {
    this.x = x;
    this.y = y;
    this.position.x = this.xOffset + this.x * this.size;
    this.position.y = this.yOffset + this.y * this.size;
  };

  roundPositions = () => {
    this.y = Math.ceil(this.y);
    this.position.y = this.yOffset + this.y * this.size;
  };

  getPosition = () => {
    return {
      x: this.x,
      y: this.y,
    };
  };

  getNextSmallMoveDown = () => {
    return { y: this.y - 0.5, x: this.x };
  };

  removeBox = () => {
    gsap.to(this.scale, {
      ease: 'power2',
      duration: 0.15,
      x: 0,
      y: 0,
      z: 0,
      onComplete: () => {
        this.removeFromParent();
        this.dispose();
      },
    });
  };

  dispose = () => {
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
  };
}
