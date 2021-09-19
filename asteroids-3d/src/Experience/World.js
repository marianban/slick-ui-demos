import * as THREE from 'three';
import Experience from './Experience.js';
import AmbientLight from './AmbientLight.js';
import SunLight from './SunLight.js';
import Asteroid from './Asteroid.js';

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
  }

  setLights() {
    this.ambientLight = new AmbientLight(this.experience);
    this.sunLight = new SunLight(this.experience);
  }

  setScene() {
    const axesHelper = new THREE.AxesHelper(10000);
    this.scene.add(axesHelper);

    // reuse material for better performance
    const asteroidMaterial = Asteroid.CreateMaterial(this.experience);

    const asteroid = new Asteroid(this.experience, asteroidMaterial);
    asteroid.addToScene();
    this.asteroid = asteroid;
  }

  resize() {}

  update() {
    if (this.ready) {
      this.asteroid.update();
    }
  }

  destroy() {}
}
