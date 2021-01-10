const sketch = function (p) {
  let font;
  const vehicles = [];

  p.preload = () => {
    font = p.loadFont('HachiMaruPop-Regular.ttf');
  };

  p.setup = () => {
    const canvas = p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
    canvas.parent('container');

    const points = font.textToPoints('hello', 400, 400, 255);

    for (let i = 0; i < points.length; i++) {
      const pt = points[i];
      vehicles.push(
        new Vehicle(
          p.createVector(p.random(p.windowWidth), p.random(p.windowHeight)),
          p.createVector(pt.x, pt.y)
        )
      );
    }
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };

  p.draw = () => {
    p.translate(-p.windowWidth / 2, -p.windowHeight / 2);
    // p.background(51);
    p.clear();
    vehicles.forEach((v) => {
      v.behaviour();
      v.update();
      v.draw();
    });
  };

  class Vehicle {
    constructor(pos, target = p.createVector()) {
      this.pos = pos;
      this.target = target;
      this.vel = p.createVector();
      this.acc = p.createVector();
      this.r = 20;
      this.maxSpeed = 10;
    }

    update() {
      this.pos.add(this.vel);
      this.vel.add(this.acc);
      this.acc.mult(0);
    }

    flee(target) {
      const desired = p5.Vector.sub(target, this.pos);
      const distance = desired.mag();
      if (distance > 150) {
        return p.createVector(0, 0);
      }
      desired.normalize();
      desired.mult(p.random(this.maxSpeed / 2, this.maxSpeed * 2));
      const steer = p5.Vector.sub(desired, this.vel);
      steer.limit(10 + p.random(30));
      steer.mult(-1);
      return steer;
    }

    arrive(target) {
      const desired = p5.Vector.sub(target, this.pos);
      const distance = desired.mag();
      let speed = this.maxSpeed;
      if (distance < 100) {
        speed = p.map(distance, 0, 100, 0, this.maxSpeed);
      }
      desired.normalize();
      desired.mult(speed);
      const steer = p5.Vector.sub(desired, this.vel);
      steer.limit(10);
      return steer;
    }

    behaviour() {
      const force = this.arrive(this.target);
      this.applyForce(force);
      if (p.mouseIsPressed) {
        const mouse = p.createVector(p.mouseX, p.mouseY);
        const fleeForce = this.flee(mouse);
        this.applyForce(fleeForce);
      }
    }

    applyForce(force) {
      this.acc.add(force);
    }

    draw() {
      p.frameRate(60);
      p.stroke('#CBFF66');
      p.strokeWeight(this.r);
      p.point(this.pos.x, this.pos.y);
    }
  }
};

new p5(sketch, 'container');
