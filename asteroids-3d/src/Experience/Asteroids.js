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
    const { VIEWPORT_OFFSET_FACTOR } = this.config;

    const { top, bottom, left, right } = this.experience.camera.viewport;

    let xmin;
    let xmax;
    let ymin;
    let ymax;

    const side = random(sides);

    if (side === 'T') {
      xmin = left;
      xmax = right;
      ymin = top;
      ymax = top * VIEWPORT_OFFSET_FACTOR;
    }
    if (side === 'R') {
      xmin = right;
      xmax = right * VIEWPORT_OFFSET_FACTOR;
      ymin = bottom;
      ymax = top;
    }
    if (side === 'B') {
      xmin = left;
      xmax = right;
      ymin = bottom * VIEWPORT_OFFSET_FACTOR;
      ymax = bottom;
    }
    if (side === 'L') {
      xmin = left * VIEWPORT_OFFSET_FACTOR;
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
        a.destroy();
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
