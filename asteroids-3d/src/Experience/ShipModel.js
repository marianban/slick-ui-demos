import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// model https://skfb.ly/QQWr
export class ShipModel {
  constructor(experience, location) {
    this.experience = experience;
    this.scene = experience.scene;
    this.location = location;
  }

  addToScene() {
    const gltfLoader = new GLTFLoader();
    gltfLoader.load(
      '/assets/space_ship_wg-02/scene.gltf',
      (gltf) => {
        const ship = gltf.scene.children[0];
        const scalar = 70;
        ship.scale.set(scalar, scalar, scalar);
        ship.rotateX(Math.PI * 0.5);
        ship.rotateZ(Math.PI);
        this.scene.add(ship);
      },
      (progress) => {
        console.log('progress');
        console.log(progress);
      },
      (error) => {
        console.log('error');
        console.log(error);
      }
    );
  }
}
