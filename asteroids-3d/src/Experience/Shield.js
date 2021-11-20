import * as THREE from 'three';
import CANNON from 'cannon';
import vertexShader from './shaders/shield/vertex.glsl';
import fragmentShader from './shaders/shield/fragment.glsl';

export class Shield {
  constructor(experience, location) {
    this.experience = experience;
    this.scene = experience.scene;
    this.location = location;

    const shieldSegments = 500;
    const radius = 100;
    const shieldGeometry = new THREE.SphereGeometry(
      radius,
      shieldSegments,
      shieldSegments
    );

    const shieldMaterial = new THREE.ShaderMaterial({
      side: THREE.FrontSide,
      transparent: true,
      // depthWrite: false,
      vertexShader,
      fragmentShader,
    });

    this.mesh = new THREE.Mesh(shieldGeometry, shieldMaterial);

    const sphereShape = new CANNON.Sphere(radius);
    const sphereBody = new CANNON.Body({
      mass: radius ** 2,
      position: this.location,
      shape: sphereShape,
    });
    this.body = sphereBody;

    this.pWorld = experience.world.pWorld;
  }

  addToScene() {
    this.scene.add(this.mesh);
    this.pWorld.addBody(this.body);
  }
}
