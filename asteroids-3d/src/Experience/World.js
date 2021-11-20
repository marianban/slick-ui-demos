import * as THREE from 'three';
import CANNON from 'cannon';
import Experience from './Experience.js';
import AmbientLight from './AmbientLight.js';
import SunLight from './SunLight.js';
import { Asteroids } from './Asteroids.js';
import { Collisions } from './Collisions.js';
import { AsteroidCollision } from './AsteroidCollision.js';
import { Background } from './Background.js';

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
    this.pWorld.solver = new CANNON.SplitSolver(this.pWorld.solver);

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
    // this.scene.add(axesHelper);

    this.asteroids = new Asteroids(this.experience);

    const collision = new AsteroidCollision(
      this.experience,
      new THREE.Vector3(0, 0, 0)
    );
    // this.collision = collision;

    this.collisions = new Collisions(this.experience);

    this.scene.add(collision.mesh);

    const bg = new Background(this.experience);
    bg.addToScene();
  }

  resize() {}

  update() {
    if (this.ready) {
      const elapsedTime = this.experience.clock.getElapsedTime();
      const deltaTime = elapsedTime - this.oldElapsedTime;
      this.pWorld.step(1 / 60, deltaTime, 3);
      this.oldElapsedTime = elapsedTime;

      this.asteroids.update();
      this.collisions.update();
      // this.collision.update();
    }
  }

  generateAsteroid() {
    this.asteroids.add(new THREE.Vector2(0, 0));
  }

  destroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
