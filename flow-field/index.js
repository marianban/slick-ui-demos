const size = 50;
let rows;
let cols;
let ants = [];

class Ant {
  constructor(location) {
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
    if (x > width) {
      this.location.x = 0;
    }
    if (x < 0) {
      this.location.x = width;
    }
    if (y > height) {
      this.location.y = 0;
    }
    if (y < 0) {
      this.location.y = height;
    }
  }

  draw() {
    push();
    fill('#000000');
    translate(this.location.x, this.location.y);
    circle(0, 0, 5);
    pop();
  }
}

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  canvas.parent('container');
  init();
  for (let i = 0; i < 10; i++) {
    ants.push(new Ant(createVector(random(width), random(height))));
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  init();
}

let noiseStep = 0.1;
let timeStep = 0.01;
let toff = 0;
const forces = [];

function draw() {
  noiseSeed(1000);
  let yoff = 0;
  let xoff = 82300;
  toff += timeStep;
  forces.length = 0;

  translate(-width / 2, -height / 2, 0);
  for (let r = 0; r <= rows; r++) {
    let y = r * size;
    yoff += noiseStep;
    xoff = 82300;
    for (let c = 0; c <= cols; c++) {
      let x = c * size;
      xoff += noiseStep;
      const n = noise(yoff, xoff, toff);
      const color = n * 255;
      const angle = n * Math.PI * 2;
      const length = 1;
      const vector = createVector(cos(angle), sin(angle));
      vector.mult(size / 2);
      const force = vector.copy();
      force.normalize();
      force.mult(0.1);
      forces.push({ force, x, y, size });
      fill(color);
      noStroke();
      rect(x, y, size);
      push();
      translate(x + size / 2, y + size / 2);
      stroke(126);
      line(0, 0, vector.x, vector.y);
      pop();
    }
  }

  for (let i = 0; i < ants.length; i++) {
    const ant = ants[i];
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

function init() {
  cols = floor(windowWidth / size);
  rows = floor(windowHeight / size);
}
