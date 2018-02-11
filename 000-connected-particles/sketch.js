const N_PARTICLES = 300,
  SPEED = 2,
  DISTANCE = 125;

var particles = new Array(N_PARTICLES),
  mouse_mode = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let i = 0; i < particles.length; i++) {
    particles[i] = new Particle(i);
  }
}

function draw() {
  background(0);
  for (let part of particles) {
    part.show();
    part.update();
  }
}

function mousePressed() {
  if (mouse_mode) mouse_mode = false;
  else mouse_mode = true;
}

class Particle {
  constructor(n, x = getRand(width), y = getRand(height)) {
    this.id = n;
    this.link = [];
    this.p = new p5.Vector(x, y);
    this.r = 1;
    angleMode(DEGREES);
    let angle = getRand(360);
    this.dir = new p5.Vector(cos(angle) * SPEED, sin(angle) * SPEED);
  }

  show() {
    this.connect();
    noStroke();
    fill("white");
    ellipse(this.p.x, this.p.y, this.r * 2, this.r * 2);
  }

  update() {
    this.p.add(this.dir);
    if (this.p.x <= 0 || this.p.x >= width - 1) this.dir.x *= -1;
    if (this.p.y <= 0 || this.p.y >= height - 1) this.dir.y *= -1;
  }

  connect() {
    let lines = 0;
    if (mouse_mode) {
      let mouse = new Particle(null, mouseX, mouseY),
        d = getDistance(this, mouse);
        if (d != 0 && d < DISTANCE) {
          stroke("white");
          line(this.p.x, this.p.y, mouse.p.x, mouse.p.y);
          lines++;
        }
    } else {
      for (let part of particles) {
        let d = getDistance(this, part)
        if (d != 0 && d < DISTANCE && !part.link.includes(this.id)) {
          stroke("white");
          line(this.p.x, this.p.y, part.p.x, part.p.y);
          lines++;
        }
      }
    }
    this.r = 1 + lines;
  }
}

function getDistance(p1, p2) {
  return p1.p.dist(p2.p);
}

function getRand(max) {
  return floor(random(max));
}
