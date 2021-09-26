import * as THREE from 'three';
import CANNON from 'cannon';
import Experience from './Experience.js';
import AmbientLight from './AmbientLight.js';
import SunLight from './SunLight.js';
import { Asteroids } from './Asteroids.js';
import { Vector2 } from 'three';

export default class World {
  constructor(_options) {
    this.experience = new Experience();
    this.config = this.experience.config;
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.ready = false;

    this.setLights();

    this.resources.on('groupEnd', (_group) => {
      if (_group.name === 'base') {
        this.setScene();
        this.ready = true;
      }
    });

    this.intervalId = setInterval(this.generateAsteroid.bind(this), 1000);

    this.pWorld = new CANNON.World();
    const defaultMaterial = new CANNON.Material('default');
    const defaultContactMaterial = new CANNON.ContactMaterial(
      defaultMaterial,
      defaultMaterial,
      {
        friction: 0.01,
        restitution: 0.3,
      }
    );
    this.pWorld.addContactMaterial(defaultContactMaterial);
    this.pWorld.defaultContactMaterial = defaultContactMaterial;

    this.oldElapsedTime = 0;
  }

  setLights() {
    this.ambientLight = new AmbientLight(this.experience);
    this.sunLight = new SunLight(this.experience);
  }

  setScene() {
    const axesHelper = new THREE.AxesHelper(10000);
    this.scene.add(axesHelper);

    this.asteroids = new Asteroids(this.experience);
  }

  resize() {}

  update() {
    if (this.ready) {
      const elapsedTime = this.experience.clock.getElapsedTime();
      const deltaTime = elapsedTime - this.oldElapsedTime;
      this.pWorld.step(1 / 60, deltaTime, 3);
      this.oldElapsedTime = elapsedTime;

      this.asteroids.update();
    }
  }

  generateAsteroid() {
    this.asteroids.add(new Vector2(0, 0));
  }

  destroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
