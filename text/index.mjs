const sketch = function (p) {
  let font;
  let text = 'hello :)';
  let letters;
  let imgs;
  let deletedLetters = new Set();

  p.preload = () => {
    font = p.loadFont('HachiMaruPop-Regular.ttf');
  };

  p.setup = () => {
    const canvas = p.createCanvas(p.windowWidth, p.windowHeight /*, p.WEBGL*/);
    canvas.parent('container');
    imgs = createImages();
    letters = convertTextToLetters(text);
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };

  p.draw = () => {
    // p.translate(-p.windowWidth / 2, -p.windowHeight / 2);
    p.clear();

    // p.background(200);

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
    if (p.keyCode === p.BACKSPACE) {
      const removed = text[text.length - 1];
      text = text.slice(0, -1);
      if (removed === ' ' || !letters.length) {
        return;
      }
      const deleted = letters.pop();
      deleted.delete();
      deletedLetters.add(deleted);
    }

    return true;
  };

  p.keyTyped = () => {
    text += p.key;

    const allLetters = convertTextToLetters(text);
    // fix for colon
    const numOfNewChars = allLetters.length - letters.length;
    if (numOfNewChars <= 0) {
      return true;
    }
    const newLetters = allLetters.slice(-1 * numOfNewChars);
    const newPoints = newLetters.reduce(
      (acc, lt) => acc.concat(lt.getPoints()),
      []
    );
    letters.push(new Letter(newPoints));

    return true;
  };

  function createImages() {
    const colors = [
      '#CBFF66',
      '#66FF70',
      '#FF6A65',
      '#FF66BA',
      '#FFD0EA',
      '#FF9694',
      '#10FC1A',
      '#AAFE0D',
    ];

    const images = [];

    for (const color of colors) {
      const canvas = document.createElement('canvas');
      const size = 60;
      canvas.width = size * window.devicePixelRatio;
      canvas.height = size * window.devicePixelRatio;
      canvas.style.width = size;
      canvas.style.height = size;
      const context = canvas.getContext('2d');
      context.shadowOffsetX = 5;
      context.shadowOffsetY = 5;
      context.shadowColor = 'rgba(0, 0, 0, .2)';
      context.shadowBlur = 20;
      context.scale(window.devicePixelRatio, window.devicePixelRatio);
      context.beginPath();
      context.arc(size / 2, size / 2, 7, 0, 2 * Math.PI, false);
      context.fillStyle = color;
      context.fill();
      context.beginPath();
      context.arc(size / 2.1, size / 2.1, 5, 0, 2 * Math.PI, false);
      context.fillStyle = p.color('rgba(255, 255, 255, .4)');
      context.fill();
      context.beginPath();
      context.translate(-12, 26);
      context.rotate((-45 * Math.PI) / 180);
      // this effect is not scalable
      context.ellipse(size / 2.2, size / 2.2, 2, 1, 0, 2 * Math.PI, false);
      context.fillStyle = p.color('rgba(255, 255, 255, .6)');

      context.fill();
      images.push(canvas);
    }

    return images;
  }

  function convertTextToLetters(text) {
    const allPoints = font
      .textToPoints(text, 40, 400, 220)
      .map((p) => ({ x: Math.round(p.x), y: Math.round(p.y) }));
    if (!allPoints.length) {
      return [];
    }
    const letterPointGroups = groupPointsByLetters(allPoints.reverse());
    return letterPointGroups.map((points) => new Letter(points));
  }

  function groupPointsByLetters(points) {
    const letters = [];
    let prev = points.pop();
    let letter = [prev];
    let next;
    while ((next = points.pop())) {
      const distanceX = next.x - prev.x;
      const distanceY = next.y - prev.y;
      const euclideanDistance = Math.sqrt(distanceX ** 2 + distanceY ** 2);
      if (euclideanDistance >= 60) {
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
    getPoints() {
      return this.points.map((p) => p.target);
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
      this.maxSpeed = 30;
      this.img = p.random(imgs);
    }

    update() {
      this.pos.add(this.vel);
      this.vel.add(this.acc);
      this.acc.mult(0);
    }

    flee(target) {
      const desired = p5.Vector.sub(target, this.pos);
      desired.normalize();
      desired.mult(p.random(this.maxSpeed / 2, this.maxSpeed));
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
      const img = this.img;
      p.drawingContext.drawImage(
        img,
        this.pos.x,
        this.pos.y,
        Math.round(img.width / window.devicePixelRatio),
        Math.round(img.height / window.devicePixelRatio)
      );
    }
  }
};

new p5(sketch, 'container');
