const sketch = function (p) {
  let font;
  let text = 'hello';
  let letters;
  let deletedLetters = new Set();

  p.preload = () => {
    font = p.loadFont('HachiMaruPop-Regular.ttf');
  };

  p.setup = () => {
    const canvas = p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
    canvas.parent('container');

    const allPoints = font.textToPoints(text, 400, 400, 255);
    const letterPointGroups = groupPointsByLetters(allPoints.reverse());

    letters = letterPointGroups.map((points) => new Letter(points));
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };

  p.draw = () => {
    p.translate(-p.windowWidth / 2, -p.windowHeight / 2);
    p.clear();
    letters.forEach((letter) => {
      letter.behaviour();
      letter.update();
      letter.draw();
    });
    Array.from(deletedLetters).forEach((letter) => {
      letter.behaviour();
      letter.update();
      letter.draw();
      if (letter.isOutside()) {
        deletedLetters.delete(letter);
      }
    });
  };

  p.keyPressed = () => {
    if (p.keyCode === p.BACKSPACE && letters.length) {
      const deleted = letters.pop();
      deleted.delete();
      deletedLetters.add(deleted);
    }
    return false; // prevent any default behaviour
  };

  function groupPointsByLetters(points) {
    const letters = [];
    let prev = points.pop();
    let letter = [prev];
    let next;
    while ((next = points.pop())) {
      const distanceX = next.x - prev.x;
      const distanceY = next.y - prev.y;
      const euclideanDistance = Math.sqrt(distanceX ** 2 + distanceY ** 2);
      if (euclideanDistance >= 70) {
        letters.push(letter.slice());
        letter = [];
      }
      letter.push(next);
      prev = next;
    }
    letters.push(letter);
    return letters;
  }

  class Letter {
    constructor(points) {
      this.points = points.map(
        (point) =>
          new Point(
            p.createVector(p.random(p.windowWidth), p.random(p.windowHeight)),
            p.createVector(point.x, point.y)
          )
      );
      this.deleted = false;
    }
    draw() {
      this.points.forEach((point) => {
        point.draw();
      });
    }
    behaviour() {
      this.points.forEach((point) => {
        point.behaviour();
      });
      if (this.deleted) {
        this.points.forEach((point) => {
          const force = point.flee(this.centroid);
          point.applyForce(force);
        });
      }
    }
    delete() {
      const xSum = this.points.reduce((sum, p) => {
        return sum + p.pos.x;
      }, 0);
      const ySum = this.points.reduce((sum, p) => {
        return sum + p.pos.y;
      }, 0);
      const x = xSum / this.points.length;
      const y = ySum / this.points.length;
      const centroid = p.createVector(x, y);
      this.centroid = centroid;

      this.deleted = true;
    }
    update() {
      this.points.forEach((point) => {
        point.update();
      });
    }
    isOutside() {
      return this.points.every((p) => isOutsideOfScreen(p.pos));
    }
  }

  function isOutsideOfScreen(pos) {
    if (pos.x < 0 || pos.x > p.width) {
      return true;
    }
    if (pos.y < 0 || pos.y > p.height) {
      return true;
    }
    return false;
  }

  class Point {
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
      // if (distance > 150) {
      //   return p.createVector(0, 0);
      // }
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
