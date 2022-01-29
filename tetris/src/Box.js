import * as THREE from 'three';
import gsap from 'gsap';
import matcap from './matcap6.png';

export class Box extends THREE.Object3D {
  constructor({ x, y, size, xOffset, yOffset, color }) {
    super();

    this.size = size;
    this.xOffset = xOffset;
    this.yOffset = yOffset;
    this.color = color;
    this.setPosition2(x, y);

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

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geometry.center();

    const textureLoader = new THREE.TextureLoader();
    const matcapTexture = textureLoader.load(`static/${matcap}`);

    const color = new THREE.Color(this.color);
    color.convertLinearToSRGB();

    let material = new THREE.MeshMatcapMaterial({ color });
    material.matcap = matcapTexture;

    // material = new THREE.MeshBasicMaterial({ color: 'red' });

    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.y = +this.size * 0.5;
    // this.mesh.position.z = -0.4;

    this.add(this.mesh);
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

  setPosition = (x, y, delay = 0) => {
    if (this.animation && this.animation.progress() < 1) {
      this.animation.progress(1).kill();
    }
    this.x = x;
    this.y = y;
    this.animation = gsap.to(this.position, {
      delay,
      duration: 0.2,
      x: this.xOffset + this.x * this.size,
      y: this.yOffset + this.y * this.size,
      ease: 'power2.inOut',
    });
    return this.animation;
  };

  setPosition2 = (x, y) => {
    this.x = x;
    this.y = y;
    this.position.x = this.xOffset + this.x * this.size;
    this.position.y = this.yOffset + this.y * this.size;
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
