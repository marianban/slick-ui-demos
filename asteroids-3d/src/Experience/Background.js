import * as THREE from 'three';

export class Background {
  constructor(experience) {
    this.experience = experience;
    this.scene = experience.scene;

    const bgSize = 5000;

    const geometry = new THREE.PlaneGeometry(bgSize, bgSize);
    const material = this.createMaterial();
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.z = -2500;
  }

  createMaterial() {
    const resources = this.experience.resources;
    const texture = resources.items.bg;
    texture.encoding = THREE.sRGBEncoding;
    const asteroidMaterial = new THREE.MeshBasicMaterial({
      map: texture,
    });
    return asteroidMaterial;
  }

  addToScene() {
    this.scene.add(this.mesh);
  }
}
