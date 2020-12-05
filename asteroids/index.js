console.clear();

const ASTEROID_MIN_SPEED = 0.1;
const ASTEROID_MAX_SPEED = 3.5;
const ASTEROID_MIN_HEALTH = 1;
const ASTEROID_MAX_HEALTH = 10;
const ASTEROID_MIN_SIZE = 30;
const ASTEROID_MAX_SIZE = 60;
const ASTEROID_MIN_POINTS = 7;
const ASTEROID_MAX_POINTS = 15;

let asteroidBg;
let bgPadding = ASTEROID_MAX_SIZE * 3;
let bgWidth = 1920 - bgPadding;
let bgHeight = 1080 - bgPadding;
let thrustImg = null;
let spaceShip;

function rotatePoint(point, origin, angle) {
  const delta = p5.Vector.sub(origin, point);
  // distance from triangle center to vertex
  let r = delta.mag();

  // angle between triangle center and vertex
  const tangle = atan2(point.y - origin.y, point.x - origin.x);

  // rotates point around origin by angle (incremented each frame)
  // alse make sure that it starts from original angle between vertex and center
  let x = origin.x + cos(angle + tangle) * r;
  let y = origin.y + sin(angle + tangle) * r;

  return createVector(x, y);
}

function asteroidShape(
  x,
  y,
  radiuses,
  xOffset = 0,
  yOffset = 0,
  highlight = false
) {
  strokeWeight(0);
  if (highlight) {
    tint(255, 127);
  }
  push();
  translate(x, y, -10);
  texture(asteroidBg);
  beginShape();
  let angle = TWO_PI / (radiuses.length - 1);
  let i = 0;
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = cos(a) * radiuses[i];
    let sy = sin(a) * radiuses[i];
    vertex(sx, sy, sx + radiuses[i] + xOffset, sy + radiuses[i] + yOffset);
    i++;
  }
  endShape(CLOSE);
  pop();
  noTint();
}

class Asteroid {
  constructor(location, velocity) {
    this.location = location;
    this.velocity = velocity;
    this.angle = 0;
    const speed = p5.Vector.sub(
      location,
      p5.Vector.add(location, velocity)
    ).mag();
    // static asteroids
    this.aVelocity = speed
      ? map(speed, ASTEROID_MIN_SPEED, ASTEROID_MAX_SPEED, 0.01, 0.1)
      : 0;
    this.isVisible = false;
    this.isOut = false;
    this.health = Math.round(random(ASTEROID_MIN_HEALTH, ASTEROID_MAX_HEALTH));
    this.size = map(
      this.health,
      ASTEROID_MIN_HEALTH,
      ASTEROID_MAX_HEALTH,
      ASTEROID_MIN_SIZE,
      ASTEROID_MAX_SIZE
    );
    this.npoints = Math.round(random(ASTEROID_MIN_POINTS, ASTEROID_MAX_POINTS));
    const offset = this.size * 0.45;
    this.radiuses = Array.from({ length: this.npoints + 1 }).map(() =>
      random(this.size - offset, this.size)
    );
    this.bgXOffset = random(0, bgWidth);
    this.bgYOffset = random(0, bgHeight);
    this.wasHit = false;
  }

  update() {
    this.wasHit = false;
    this.angle += this.aVelocity;
    this.location.add(this.velocity);
    this.updateOut();
    this.updateVisibility();
  }

  draw() {
    push();
    translate(this.location.x, this.location.y);
    rotate(this.angle);
    asteroidShape(
      0,
      0,
      this.radiuses,
      this.XOffset,
      this.bgYOffset,
      this.wasHit
    );
    pop();
  }

  updateVisibility() {
    if (
      this.location.x > 0 &&
      this.location.x < width &&
      this.location.y > 0 &&
      this.location.y < height
    ) {
      this.isVisible = true;
    }
  }

  updateOut() {
    if (!this.isVisible) {
      return;
    }
    if (
      this.location.x < 0 ||
      this.location.x > width ||
      this.location.y < 0 ||
      this.location.y > height
    ) {
      this.isOut = true;
    }
  }

  isDead() {
    return this.health <= 0;
  }

  contains(point) {
    const half = this.size / 2;
    if (
      this.location.x - half <= point.x &&
      point.x <= this.location.x + half &&
      this.location.y - half <= point.y &&
      point.y <= this.location.y + half
    ) {
      return true;
    }
    return false;
  }

  hit(value) {
    this.health -= value;
    this.wasHit = true;
  }
}

const sides = ['L', 'R', 'T', 'B'];

class Asteroids {
  constructor() {
    this.asteroids = new Set();
  }

  add(target) {
    if (frameCount % 10 !== 0) {
      return;
    }

    const value = random();
    if (value > 0.1) {
      return;
    }

    const xOffset = width * 0.2;
    const yOffset = height * 0.2;

    let xmin;
    let xmax;
    let ymin;
    let ymax;

    const side = random(sides);

    if (side === 'T') {
      xmin = -xOffset;
      xmax = width + xOffset;
      ymin = 0;
      ymax = -yOffset;
    }
    if (side === 'R') {
      xmin = width;
      xmax = width + xOffset;
      ymin = -yOffset;
      ymax = height + yOffset;
    }
    if (side === 'B') {
      xmin = -xOffset;
      xmax = width + xOffset;
      ymin = height;
      ymax = height + yOffset;
    }
    if (side === 'L') {
      xmin = -xOffset;
      xmax = 0;
      ymin = -yOffset;
      ymax = height + yOffset;
    }

    const x = random(xmin, xmax);
    const y = random(ymin, ymax);
    const location = createVector(x, y);
    const velocity = p5.Vector.sub(target, location);
    velocity.normalize();
    velocity.mult(random(ASTEROID_MIN_SPEED, ASTEROID_MAX_SPEED));
    this.asteroids.add(new Asteroid(location, velocity));
  }

  update() {
    this.asteroids.forEach((a) => {
      a.update();
      if (a.isOut || a.isDead()) {
        this.asteroids.delete(a);
      }
    });
  }

  draw() {
    this.asteroids.forEach((a) => {
      a.draw();
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

class Projectile {
  constructor(location, direction) {
    this.life = 255;
    this.location = location.copy();
    this.prevLocation = this.location.copy();
    this.direction = direction;
    this.angle = 0;
    this.size = 5;
  }
  update() {
    const dir = this.direction.copy();
    dir.setMag(15);
    dir.mult(-1);
    this.prevLocation = this.location.copy();
    this.location.add(dir);
    this.life -= 1;
  }
  isDead() {
    return (
      this.location.x < 0 ||
      this.location.x > width ||
      this.location.y < 0 ||
      this.location.y > height
    );
  }
  draw() {
    stroke(color('#E6F7D2'));
    strokeWeight(3);
    line(
      this.prevLocation.x,
      this.prevLocation.y,
      this.location.x,
      this.location.y
    );
  }
}

class Projectiles {
  constructor() {
    this.projectiles = new Set();
  }

  add(location, direction) {
    this.projectiles.add(new Projectile(location, direction));
  }

  update() {
    this.projectiles.forEach((p) => {
      p.update();
      if (p.isDead()) {
        this.projectiles.delete(p);
      }
    });
  }

  draw() {
    this.projectiles.forEach((p) => {
      p.draw();
    });
  }

  hit(asteroid) {
    const nailedProjectiles = Array.from(this.projectiles).filter((p) =>
      asteroid.contains(p.location)
    );
    const hitCount = nailedProjectiles.length;
    if (hitCount > 0) {
      asteroid.hit(hitCount);
    }
    nailedProjectiles.forEach((p) => {
      this.projectiles.delete(p);
    });
    return nailedProjectiles;
  }
}

class ImpactProjectile {
  constructor(location) {
    this.lifeSpan = 60 * 1;
    this.life = this.lifeSpan;
    this.lifeStep = 255 / this.life;
    const offset = 20;
    this.location = p5.Vector.add(
      location,
      createVector(random(-offset, offset), random(-offset, offset))
    );
    this.size = random(2, 10);
  }
  update() {
    this.life -= this.lifeStep;
  }
  isDead() {
    return this.life <= 0;
  }
  draw() {
    push();
    translate(this.location.x, this.location.y, 5);
    scale(max(1, this.life) / max(1, this.lifeSpan));
    const c = color('#F4F590');
    c.setAlpha(this.life);
    blendMode(SCREEN);
    fill(c);
    stroke(c);
    circle(0, 0, this.size);
    blendMode(BLEND);
    pop();
  }
}

class ImpactProjectiles {
  constructor() {
    this.projectiles = new Set();
  }

  add(location) {
    for (let i = 0; i <= 3; i++) {
      this.projectiles.add(new ImpactProjectile(location));
    }
  }

  update() {
    this.projectiles.forEach((p) => {
      p.update();
      if (p.isDead()) {
        this.projectiles.delete(p);
      }
    });
  }

  draw() {
    this.projectiles.forEach((p) => {
      p.draw();
    });
  }
}

class Ship {
  constructor() {
    this.angle = radians(0);
    this.location = createVector(width / 2, height / 2);
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);
    this.direction = createVector(0, 0);
    this.origin = createVector(0, 0);
    this.angleAcceleration = 0.1;
    this.projectiles = new Projectiles();
    this.impactProjectiles = new ImpactProjectiles();
    this.size = 25;
    this.half = this.size / 2;
  }
  update() {
    this.velocity.add(this.acceleration);
    const maxVelocity = 3;
    this.velocity.x = constrain(this.velocity.x, -maxVelocity, maxVelocity);
    this.velocity.y = constrain(this.velocity.y, -maxVelocity, maxVelocity);
    this.location.add(this.velocity);
    this.acceleration.mult(0);
    this.projectiles.update();
    this.impactProjectiles.update();
  }
  applyForce(force) {
    this.acceleration.add(force);
  }
  shoot() {
    const SPACE = 32;
    if (keyIsDown(SPACE) && frameCount % 4 == 0) {
      let rightCannon = createVector(this.origin.x + 28, this.origin.y - 10);
      rightCannon = rotatePoint(rightCannon, this.origin, this.angle);

      let leftCannon = createVector(this.origin.x - 28, this.origin.y - 10);
      leftCannon = rotatePoint(leftCannon, this.origin, this.angle);

      this.projectiles.add(leftCannon, this.direction);
      this.projectiles.add(rightCannon, this.direction);
    }
  }
  draw() {
    const size = this.size;
    const half = this.half;
    stroke(0);
    strokeWeight(1);

    let x1 = this.location.x - half;
    let y1 = this.location.y;
    let x2 = this.location.x;
    let y2 = this.location.y - size;
    let x3 = this.location.x + half;
    let y3 = this.location.y;
    this.origin = createVector(this.location.x, this.location.y - size / 2.5);
    let v1 = createVector(x1, y1);
    v1 = rotatePoint(v1, this.origin, this.angle);
    let v2 = createVector(x2, y2);
    v2 = rotatePoint(v2, this.origin, this.angle);
    let v3 = createVector(x3, y3);
    v3 = rotatePoint(v3, this.origin, this.angle);

    this.direction = p5.Vector.sub(this.origin, v2).normalize();

    push();

    stroke(color('#6D4717'));
    fill('#FFEFC0');
    strokeWeight(0.5);
    ambientLight(150);
    directionalLight(255, 255, 255, 400, 200, 0);
    translate(this.origin.x, this.origin.y, 7);
    scale(0.3);
    rotateZ(this.angle);
    rotateX(radians(90));
    model(spaceShip);
    pop();

    /*
    blendMode(SCREEN);
    for(let i=0; i<10; i++) {
      push();

      translate(this.origin.x + random(-2, 2), this.origin.y + i + random(-2, 2));
      rotateZ(this.angle);
      translate(0, 45);
      scale(1/15);
      strokeWeight(0);
      rotate(radians(-90));
      fill(0,0,0,0);
      texture(thrustImg);
      plane(thrustImg.width, thrustImg.height);
      pop();
    }
    blendMode(BLEND);
    */

    this.projectiles.draw();
    this.impactProjectiles.draw();
  }
  left() {
    this.angle -= this.angleAcceleration;
  }
  right() {
    this.angle += this.angleAcceleration;
  }
  forward() {
    const force = createVector(-0.05, -0.05);
    force.mult(this.direction);
    this.applyForce(force);
  }
  backward() {
    const force = createVector(0.05, 0.05);
    force.mult(this.direction);
    this.applyForce(force);
  }
  bounds() {
    if (this.location.x < 0) {
      this.location.x = width;
    } else if (this.location.x > width) {
      this.location.x = 0;
    }
    if (this.location.y < 0) {
      this.location.y = height;
    } else if (this.location.y > height) {
      this.location.y = 0;
    }
  }
  hit(asteroid) {
    const projectiles = this.projectiles.hit(asteroid);
    projectiles.forEach((p) => {
      this.impactProjectiles.add(p.location);
    });
    return projectiles.length;
  }
}

let ship;
let asteroids;
let gameScore;
let $gameScore = null;

function preload() {
  asteroidBg = loadImage(
    'https://res.cloudinary.com/dzadmlxnt/image/upload/v1606642498/asteroids/asteroids-bg_p4dfyc-optimized_oidd13.jpg'
  );
  // https://free3d.com/3d-model/low-poly-spaceship-37605.html
  spaceShip = loadModel(
    'https://res.cloudinary.com/dzadmlxnt/raw/upload/v1605625376/asteroids/SpaceShip_x7aymb.obj',
    true
  );
}

function setup() {
  document.querySelector('.loader').remove();
  const canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  canvas.parent('game-container');
  ship = new Ship();
  asteroids = new Asteroids();
  gameScore = 0;
  $gameScore = document.getElementById('score');
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  translate(-width / 2, -height / 2, 0);
  clear();
  if (keyIsDown(LEFT_ARROW)) {
    ship.left();
  }
  if (keyIsDown(RIGHT_ARROW)) {
    ship.right();
  }
  if (keyIsDown(UP_ARROW)) {
    ship.forward();
  }
  if (keyIsDown(DOWN_ARROW)) {
    ship.backward();
  }

  asteroids.update();
  asteroids.add(ship.location);
  gameScore += asteroids.hitBy(ship);
  asteroids.draw();
  drawScore();

  ship.update();
  ship.bounds();
  ship.shoot();
  ship.draw();
}

function drawScore() {
  const sScore = gameScore.toString().padStart('4', '0');
  $gameScore.innerText = sScore;
}
