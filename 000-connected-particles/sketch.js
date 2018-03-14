/**
 * This code will create a net of connected particles; the more connections a particle has, the bigger it is
 * Clicking with the mouse will only show the connections between the mouse and the particles around it
 */
const N_PARTICLES = 300,
  SPEED = 2,
  DISTANCE = 125;

var particles = new Array(N_PARTICLES),
  mouse_mode = false;

function setup() {
  //Craete the canvas and the particles
  createCanvas(windowWidth, windowHeight);
  for (let i = 0; i < particles.length; i++) {
    particles[i] = new Particle(i);
    console.log("hey");
  }
}


function draw() {
  //Draw and update the particles
  background(0);
  for (let part of particles) {
    part.show();
    part.update();
  }
}

function mousePressed() {
  //Switch mode
  if (mouse_mode) mouse_mode = false;
  else mouse_mode = true;
}

class Particle {
  constructor(n, x = getRand(width), y = getRand(height)) {
    this.id = n;
    this.link = [];
    this.p = createVector(x, y);
    this.r = 1;
    angleMode(DEGREES);
    let angle = getRand(360);
    this.dir = createVector(cos(angle) * SPEED, sin(angle) * SPEED);
  }

  show() {
    //Draw the particle and check for connections
    stroke(255);
    strokeWeight(this.r * 2);
    point(this.p.x, this.p.y);
    this.connect();
  }

  update() {
    //Move the particle and make it bounce if out of canvas
    this.p.add(this.dir);
    if (this.p.x <= 0 || this.p.x >= width - 1) this.dir.x *= -1;
    if (this.p.y <= 0 || this.p.y >= height - 1) this.dir.y *= -1;
  }

  connect() {
    let lines = 0;
    if (mouse_mode) {
      //If in "mouse mode", create a mouse particle and check for other particles. If in range, draw the line
      let mouse = new Particle(null, mouseX, mouseY),
        d = getDistance(this, mouse);
      if (d != 0 && d < DISTANCE) {
        strokeWeight(1);
        line(this.p.x, this.p.y, mouse.p.x, mouse.p.y);
        lines++;
      }
    } else {
      //If not in "mouse mode", check for every particle connections, avoiding connections to theirselves and double connections
      for (let part of particles) {
        let d = getDistance(this, part);
        if (d != 0 && d < DISTANCE && !part.link.includes(this.id)) {
          strokeWeight(1);
          line(this.p.x, this.p.y, part.p.x, part.p.y);
          lines++;
        }
      }
    }

    //Set the radius of the particle
    this.r = 1 + lines;
  }
}

function getDistance(p1, p2) {
  return p1.p.dist(p2.p);
}

function getRand(max) {
  return floor(random(max));
}