import { Vector2 } from 'three';
import { random } from './utils';
import { Asteroid } from './Asteroid';

const sides = ['L', 'R', 'T', 'B'];

export class Asteroids {
  constructor(experience) {
    this.experience = experience;
    this.config = this.experience.config;

    this.asteroidMaterial = Asteroid.CreateMaterial(this.experience);

    this.asteroids = new Set();
  }

  add(target) {
    // const value = random();
    // if (value > 0.1) {
    //   return;
    // }

    const { width, height } = this.config;

    const { top, bottom, left, right } = this.experience.camera.viewport;

    const xOffset = width * 0.2;
    const yOffset = height * 0.2;

    let xmin;
    let xmax;
    let ymin;
    let ymax;

    const side = random(sides);

    if (side === 'T') {
      xmin = left;
      xmax = right;
      ymin = top;
      ymax = top + top * 0.2;
    }
    if (side === 'R') {
      xmin = right;
      xmax = right + right * 0.2;
      ymin = bottom;
      ymax = top;
    }
    if (side === 'B') {
      xmin = left;
      xmax = right;
      ymin = bottom + bottom * 0.2;
      ymax = bottom;
    }
    if (side === 'L') {
      xmin = left + left * 0.2;
      xmax = left;
      ymin = bottom;
      ymax = top;
    }

    const x = random(xmin, xmax);
    const y = random(ymin, ymax);
    const location = new Vector2(x, y);

    const velocity = target.clone().sub(location);
    velocity.normalize();
    const { ASTEROID_MIN_SPEED, ASTEROID_MAX_SPEED } = this.config;
    velocity.multiplyScalar(random(ASTEROID_MIN_SPEED, ASTEROID_MAX_SPEED));

    const asteroid = new Asteroid(
      this.experience,
      this.asteroidMaterial,
      location,
      velocity
    );

    asteroid.addToScene();

    this.asteroids.add(asteroid);
  }

  update() {
    this.asteroids.forEach((a) => {
      a.update();
      if (a.isOut || a.isDead()) {
        this.asteroids.delete(a);
      }
    });
  }

  hitBy(ship) {
    let score = 0;
    this.asteroids.forEach((a) => {
      score += ship.hit(a);
    });
    return score;
  }
}
