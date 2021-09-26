import * as THREE from 'three';
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
