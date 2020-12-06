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
    this.acceleration.mult(0);
  }

  draw() {
    push();
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

  translate(-width / 2, -height / 2, 0);
  for (let r = 0; r <= rows; r++) {
    let y = r * size;
    yoff += noiseStep;
    xoff = 82300;
    for (let c = 0; c <= cols; c++) {
      let x = c * size;
      xoff += noiseStep;
      const n = noise(yoff, xoff);
      const color = n * 255;
      const angle = n * Math.PI * 2;
      const length = 1;
      const vector = createVector(cos(angle), sin(angle));
      vector.mult(size / 2);
      forces.push(vector);
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
}

function init() {
  cols = floor(windowWidth / size);
  rows = floor(windowHeight / size);
}
