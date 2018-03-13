/**
 * This is my version of this video by The Coding Train: https://www.youtube.com/watch?v=17WoOqgXsRM&index=1&list=PLRqwX-V7Uu6ZiZxtDDRCi6uhfTH4FilpH
 */

const N = 100,
  SPEED = 1.03;

var stars = new Array(N);

function setup() {
  //Create the canvas and the stars
  createCanvas(800, 800);
  for (let i = 0; i < stars.length; i++) {
    stars[i] = new Star();
  }
}

function draw() {
  //Draw and update the stars
  background(0);
  translate(width / 2, height / 2);
  for (let star of stars) {
    star.show();
    star.update();
  }
}

class Star {
  constructor(x = random(-width / 2, width / 2), y = random(-height / 2, height / 2)) {
    this.p = createVector(x, y);
    this.l = this.p.copy();
    this.v = SPEED;
  }

  show() {
    //Draw the star itself with a point; the more it "gets closer" the more the point is bigger
    stroke(255);
    strokeWeight(this.v);
    point(this.p.x, this.p.y);

    //Reset the strokeWeight and draw a line from the star to the l vector
    strokeWeight(1);
    line(this.p.x, this.p.y, this.l.x, this.l.y);
  }

  update() {
    //Calculate the movement vector, add it to the position and to the line vector (I used 1/2 of the vector)
    let move = this.p.copy().normalize().mult(this.v);
    this.v *= SPEED;
    this.p.add(move);
    this.l.add(move.copy().div(2));

    //If the star (including the line) is no more visible, reset it
    if (this.l.x < -width / 2 || this.l.x >= width / 2 || this.l.y < -height / 2 || this.l.y >= height / 2) this.die();
  }

  die() {
    this.p = createVector(random(-width / 2, width / 2), random(-height / 2, height / 2));
    this.l = this.p.copy();
    this.v = 1;
  }
}
