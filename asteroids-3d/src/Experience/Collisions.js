import * as THREE from 'three';
import { AsteroidCollision } from './AsteroidCollision.js';

export class Collisions {
  constructor(experience) {
    this.experience = experience;
    this.scene = experience.scene;
    this.pWorld = experience.world.pWorld;
    this.config = experience.config;

    this.collisions = new Set();
  }

  update() {
    this.processCollisions();
    this.updateCollisions();
  }

  processCollisions() {
    for (const contact of this.pWorld.contacts) {
      const { bi, ri, bj } = contact;
      const bodyPosition = bi.position.clone();
      const contactPosition = bodyPosition.vadd(ri);
      if (
        bi.userData.type === 'asteroid' &&
        bi.userData.type === bj.userData.type
      ) {
        const collision = new AsteroidCollision(
          this.experience,
          new THREE.Vector3().copy(contactPosition)
        );
        collision.addToScene();
        this.collisions.add(collision);
      }
    }
  }

  updateCollisions() {
    this.collisions.forEach((c) => {
      c.update();
      if (c.isDone()) {
        c.destroy();
        this.collisions.delete(c);
      }
    });
  }
}
