import * as THREE from 'three';
import CANNON from 'cannon';
import { ShipModel } from './ShipModel.js';
import { Shield } from './Shield.js';
import { Vector3 } from 'three';

export class Ship {
  constructor(experience, location) {
    this.experience = experience;
    this.scene = experience.scene;
    this.location = location;

    this.direction = new THREE.Vector3(0, 0, 0);

    this.group = new THREE.Group();

    //this.location.z = 200;

    // this.shipModel = new ShipModel(
    //   { ...this.experience, scene: this.group },
    //   this.location
    // );
    // this.shipModel.addToScene();

    this.shield = new Shield(
      { ...this.experience, scene: this.group },
      this.location
    );
    this.shield.addToScene();

    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
  }

  handleKeyDown = (event) => {
    switch (event.code) {
      case 'KeyS':
      case 'ArrowDown':
        // Handle "back"
        console.log('back');
        const vBack = new THREE.Vector3(0, -200, 0);
        this.direction.copy(vBack);
        break;
      case 'KeyW':
      case 'ArrowUp':
        // Handle "forward"
        console.log('forward');
        const vForward = new THREE.Vector3(0, 200, 0);
        this.direction.copy(vForward);
        break;
      case 'KeyA':
      case 'ArrowLeft':
        // Handle "turn left"
        console.log('left');
        this.shield.body.angularVelocity.z = 2;
        break;
      case 'KeyD':
      case 'ArrowRight':
        // Handle "turn right"
        console.log('right');
        this.shield.body.angularVelocity.z = -2;
        break;
    }

    const direction = new Vector3(0, 0, 0);
    direction.copy(this.direction);
    direction.applyQuaternion(this.shield.body.quaternion);
    this.shield.body.velocity.x = direction.x;
    this.shield.body.velocity.y = direction.y;
  };

  handleKeyUp = (event) => {
    switch (event.code) {
      case 'KeyS':
      case 'ArrowDown':
        break;
      case 'KeyW':
      case 'ArrowUp':
        break;
      case 'KeyA':
      case 'ArrowLeft':
        this.shield.body.angularVelocity.z = 0;
        break;
      case 'KeyD':
      case 'ArrowRight':
        this.shield.body.angularVelocity.z = 0;
        break;
    }
  };

  addToScene() {
    this.scene.add(this.group);
  }

  update() {
    if (this.shield) {
      this.group.position.copy(this.shield.body.position);
      this.group.quaternion.copy(this.shield.body.quaternion);
    }
  }
}
