import { initForm, $ } from './framework.mjs';

let rows;
let cols;
const settings = {
  cellSize: 50,
  particles: 100,
  noiseSeed: 1000,
  spaceNoiseStep: 0.5,
  timeNoiseStep: 0.02,
  timeNoiseOffset: 0,
  xNoiseOffset: 0,
  yNoiseOffset: 82300,
  brushSize: 1,
};

let particles = [];

const sketch = function (p) {
  let toff = 0;
  let isDrawing = false;

  p.setup = () => {
    const canvas = p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
    canvas.parent('container');

    const {
      elements: { startBtn, stopBtn, clearBtn },
      on,
    } = initForm(settings);

    startBtn.addEventListener('click', () => {
      isDrawing = true;
    });

    stopBtn.addEventListener('click', () => {
      isDrawing = false;
    });

    clearBtn.addEventListener('click', () => {
      p.background(p.color('#000093'));
    });

    on('particles', () => {
      initParticles();
    });

    initGrid();
    initParticles();

    p.background(p.color('#000093'));

    toff = settings.timeNoiseOffset;
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    initGrid();
  };

  p.draw = () => {
    //blendMode(OVERLAY);
    if (!isDrawing) {
      return;
    }
    p.noiseSeed(settings.noiseSeed);
    p.translate(-p.width / 2, -p.height / 2, 0);
    const forces = generateFlowField();
    drawParticles(forces);
  };

  function initGrid() {
    const { cellSize } = settings;
    cols = p.floor(p.windowWidth / cellSize);
    rows = p.floor(p.windowHeight / cellSize);
  }

  function initParticles() {
    const numOfNewParticles = settings.particles - particles.length;
    if (numOfNewParticles > 0) {
      for (let i = 0; i < numOfNewParticles; i++) {
        particles.push(
          new Particle(p.createVector(p.random(p.width), p.random(p.height)))
        );
      }
    } else {
      particles.splice(-Math.min(particles.length - 1, numOfNewParticles * -1));
    }
  }

  function generateFlowField() {
    const {
      cellSize,
      spaceNoiseStep,
      timeNoiseStep,
      xNoiseOffset,
      yNoiseOffset,
    } = settings;

    toff += timeNoiseStep;
    let yoff = xNoiseOffset;
    let xoff = yNoiseOffset;
    const forces = [];

    for (let r = 0; r <= rows; r++) {
      let y = r * cellSize;
      yoff += spaceNoiseStep;
      xoff = 82300;
      for (let c = 0; c <= cols; c++) {
        let x = c * cellSize;
        xoff += spaceNoiseStep;
        const n = p.noise(yoff, xoff, toff);
        const angle = n * Math.PI * 2;
        const vector = p.createVector(p.cos(angle), p.sin(angle));
        vector.mult(cellSize / 2);
        const force = vector.copy();
        force.normalize();
        force.mult(0.1);
        forces.push({ force, x, y, size: cellSize });
      }
    }

    return forces;
  }

  function drawParticles(forces) {
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
  }

  class Particle {
    constructor(location) {
      this.prevLocation = location;
      this.location = location;
      this.velocity = p.createVector(0, 0);
      this.acceleration = p.createVector(0, 0);
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
      if (x >= p.width) {
        this.location.x = 0;
        this.prevLocation.x = 0;
      }
      if (x <= 0) {
        this.location.x = p.width;
        this.prevLocation.x = p.width;
      }
      if (y >= p.height) {
        this.location.y = 0;
        this.prevLocation.y = 0;
      }
      if (y <= 0) {
        this.location.y = p.height;
        this.prevLocation.y = p.height;
      }
    }

    draw() {
      p.strokeWeight(settings.brushSize);
      p.stroke(p.color(20, 20, 20, 20));

      p.line(
        this.prevLocation.x,
        this.prevLocation.y,
        this.location.x,
        this.location.y
      );

      this.prevLocation = this.location.copy();
    }
  }
};

new p5(sketch, 'container');
