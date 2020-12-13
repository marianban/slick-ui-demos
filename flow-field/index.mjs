import { initForm } from './framework.mjs';

let rows;
let cols;
const settings = {
  cellSize: 50,
  particles: 100,
  noiseSeed: 1000,
  spaceNoiseStep: 0.5,
  timeNoiseStep: 0.02,
};

let particles = [];

class Particle {
  constructor(location) {
    this.prevLocation = location;
    this.location = location;
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);
  }

  applyForce(force) {
    this.acceleration.add(force);
  }

  update() {
    this.velocity.add(this.acceleration);
    this.velocity.limit(5);
    this.location.add(this.velocity);
    this.acceleration.mult(0);
  }

  within(element) {
    const { x, y } = this.location;
    if (
      element.x < x &&
      x < element.x + element.size &&
      element.y < y &&
      y < element.y + element.size
    ) {
      return true;
    }
    return false;
  }

  bounds() {
    const { x, y } = this.location;
    if (x >= width) {
      this.location.x = 0;
      this.prevLocation.x = 0;
    }
    if (x <= 0) {
      this.location.x = width;
      this.prevLocation.x = width;
    }
    if (y >= height) {
      this.location.y = 0;
      this.prevLocation.y = 0;
    }
    if (y <= 0) {
      this.location.y = height;
      this.prevLocation.y = height;
    }
  }

  draw() {
    stroke(color(20, 20, 20, 20));

    line(
      this.prevLocation.x,
      this.prevLocation.y,
      this.location.x,
      this.location.y
    );

    this.prevLocation = this.location.copy();
  }
}

const sketch = function (p) {
  p.setup = () => {
    const canvas = p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
    canvas.parent('container');

    initForm(settings);

    initGrid();
    initParticles();

    p.background(p.color('#000093'));
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    initGrid();
  };

  let toff = 0;
  const forces = [];

  p.draw = () => {
    //blendMode(OVERLAY);

    const { cellSize, spaceNoiseStep, timeNoiseStep } = settings;

    return;
    noiseSeed(1000);
    let yoff = 0;
    let xoff = 82300;
    toff += timeNoiseStep;
    forces.length = 0;

    translate(-width / 2, -height / 2, 0);

    for (let r = 0; r <= rows; r++) {
      let y = r * cellSize;
      yoff += spaceNoiseStep;
      xoff = 82300;
      for (let c = 0; c <= cols; c++) {
        let x = c * cellSize;
        xoff += spaceNoiseStep;
        const n = noise(yoff, xoff, toff);
        const angle = n * Math.PI * 2;
        const vector = createVector(cos(angle), sin(angle));
        vector.mult(cellSize / 2);
        const force = vector.copy();
        force.normalize();
        force.mult(0.1);
        forces.push({ force, x, y, size: cellSize });
      }
    }

    for (let i = 0; i < particles.length; i++) {
      const ant = particles[i];
      for (let j = 0; j < forces.length; j++) {
        const box = forces[j];
        if (ant.within(box)) {
          const { force } = box;
          ant.applyForce(force);
        }
      }
      ant.update();
      ant.bounds();
      ant.draw();
    }
  };

  function initGrid() {
    const { cellSize } = settings;
    cols = p.floor(p.windowWidth / cellSize);
    rows = p.floor(p.windowHeight / cellSize);
  }

  function initParticles() {
    for (let i = 0; i < settings.particles.length; i++) {
      particles.push(new Particle(createVector(random(width), random(height))));
    }
  }
};

new p5(sketch, 'container');
