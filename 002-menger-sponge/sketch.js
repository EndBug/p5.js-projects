/**
 * This program is my version of the Menger Sponge (https://en.wikipedia.org/wiki/Menger_sponge)
 * Remade from this video by The Coding Train: https://youtu.be/LG8ZK-rRkXo
 */

var sponge = [];

function setup() {
  //Create the canvas, the first box and the visual effects
  createCanvas(800, 800, WEBGL);
  sponge.push(new Box);
  ortho();
  lights();
}

function draw() {
  orbitControl();
  noStroke();
  background(0);
  fill(250);
  for (let box of sponge) {
    box.show();
  }
}

//Since there's no corresponding function to lights() in Processing, I had to do it in this way
//Suggested by George Profenza [https://goo.gl/8WK3iA]
function lights() {
  pointLight(255, 255, 255, 500, 0, 200);
  directionalLight(255, 255, 255, -1, 0, 0);
  pointLight(255, 255, 255, 0, 300, 300);
}

//When a key is pressed, create another set of boxes
function keyPressed() {
  //I excluded the F5
  if (keyCode != 116) {
    let next = [];
    for (let box of sponge) {
      next = next.concat(box.generate());
    }
    sponge = next;
  }
}

class Box {
  constructor(x = 0, y = 0, z = 0, s = 300) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.s = s;
  }

  show() {
    push();
    translate(this.x, this.y, this.z);
    ambientMaterial(250);
    box(this.s);
    pop();
  }

  //For every possible coordinates, check if the box will be visible (if two coordinates are 0 it will be "removed" from the sponge)
  //If so, add it to the array. Return the array
  generate() {
    let next = [];
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          let nr = this.s / 3;
          if (abs(x) + abs(y) + abs(z) > 1) next.push(new Box(this.x + x * nr, this.y + y * nr, this.z + z * nr, nr));
        }
      }
    }
    return next;
  }
}