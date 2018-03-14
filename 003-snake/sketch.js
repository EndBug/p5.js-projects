/**
 * This is my version of te game "Snake" (https://en.wikipedia.org/wiki/Snake_(video_game_genre))
 * Font credit: http://www.fontspace.com/codeman38/press-start-2p
 */

//Set visual variables
const SCREEN = 800,
  BOX = 40;

//Other stuff
var UP, DOWN, RIGHT, LEFT, CONTROLS,
  snake,
  sec,
  walls = [], //You can also add walls, I didn't use them in this example
  food = [],
  world = [],
  stat = "start",
  font;

//Preload the font
function preload() {
  font = loadFont("font/PressStart2P.ttf");
}

//Create controls, directions and prepare for start
function setup() {
  CONTROLS = {
    up: [UP_ARROW, "w"],
    down: [DOWN_ARROW, "s"],
    left: [LEFT_ARROW, "a"],
    right: [RIGHT_ARROW, "d"],
    new_game: ["n"],
    start: [ENTER]
  };
  createCanvas(SCREEN, SCREEN);
  UP = createVector(0, -BOX);
  DOWN = createVector(0, BOX);
  RIGHT = createVector(BOX, 0);
  LEFT = createVector(-BOX, 0);
  snake = new Snake();
  sec = second();
  new Apple;
}

function draw() {
  if (sec != second()) {
    background(0);
    translate(width / 2, height / 2);
    if (stat == "start") { //start menu
      fill(255);
      textAlign(CENTER, CENTER);
      textFont(font);
      textSize(72);
      text("SNAKE", 0, 0);
      textSize(16);
      text(`More or less...\nPress ENTER to start`, 0, height / 10);
      textAlign(RIGHT, BOTTOM);
      textSize(8);
      text("Poorly made by EndBug", width / 2.55, height / 2);
    } else if (stat == "play") { //actual game
      fill(255);
      noStroke();
      snake.update();
      for (let f of food) {
        f.show();
      }
      snake.show();
      sec = second();
    } else if (stat == "dead") { //game over screen
      fill(255);
      textAlign(CENTER, CENTER);
      textFont(font);
      textSize(72);
      text("GAME OVER", 0, 0);
      textSize(16);
      text(`Press ${CONTROLS.new_game[0].toUpperCase()} to start new game...`, 0, height / 10);
    }
  }
}

//Keyboard controls
function keyPressed() {
  if (pressed(CONTROLS.up)) snake.dir = UP;
  else if (pressed(CONTROLS.down)) snake.dir = DOWN;
  else if (pressed(CONTROLS.left)) snake.dir = LEFT;
  else if (pressed(CONTROLS.right)) snake.dir = RIGHT;
  else if (pressed(CONTROLS.start) && stat == "start") stat = "play";
  else if (pressed(CONTROLS.new_game) && stat == "dead") stat = "play";
}


/**
 * pressed - Returns if the array contains the pressed key
 *
 * @param  {Array}   array The array to check
 * @return {Boolean}
 */
function pressed(array) {
  return (array.includes(keyCode) || array.includes(key));
}


/**
 * Vector.prototype.collidesWith - Checks collision between vectors
 *
 * @param  {p5.Vector} v The other vector
 * @return {Boolean}
 */
p5.Vector.prototype.collidesWith = function(v) {
  if (v.constructor === Array) {
    let flag = false;
    for (let vector of v) {
      if (this.x == vector.x && this.y == vector.y) flag = true;
    }
    return flag;
  } else return (this.x == v.x && this.y == v.y);
};


class Apple {
  //Set a random position and add the Apple to arrays
  constructor() {
    this.p = createVector(r(width / 2), r(height / 2));
    while (this.p.collidesWith(world)) this.p = createVector(r(width), r(height));
    this.eaten = false;
    world.push(this.p);
    food.push(this);
  }

  show() {
    if (this.eaten) {
      new Apple;
      this.remove();
    } else {
      push();
      fill("red");
      rect(this.p.x, this.p.y, BOX, BOX);
      pop();
    }
  }

  remove() {
    world.splice(world.indexOf(this), 1);
    food.splice(food.indexOf(this), 1);
  }
}

class Snake {
  //Init snake
  constructor() {
    this.head = createVector(0, 0);
    world.push(this.head);
    this.parts = [];
    this.future_part = null;
    this.dir = DOWN;
    this.dir_q = [DOWN];
  }

  show() {
    push();
    rect(this.head.x, this.head.y, BOX, BOX);
    for (let p of this.parts) {
      rect(p.x, p.y, BOX, BOX);
    }
    pop();
  }

  //Check if the snake is going to die, grow or move
  update() {
    let dont = [].concat(walls).concat(this.parts),
      dead = false;
    if (this.head.collidesWith(dont)) dead = true;
    for (let i = 0; i < food.length; i++) {
      if (this.head.collidesWith(food[i].p)) {
        food[i].eaten = true;
        this.grow();
      }
    }
    if (dead) this.die();
    else this.move();
    if (this.future_part != null) {
      this.parts.push(this.future_part);
      this.future_part = null;
    }
  }

  //Add a new part at the end
  grow() {
    let length = this.parts.length;
    if (length == 0) this.future_part = this.head.copy();
    else this.future_part = this.parts[length - 1].copy();
  }

  //Move the snake and check for canvas borders
  move() {
    let to_move = [this.head].concat(this.parts);
    this.dir_q.unshift(this.dir);
    for (let i = 0; i < to_move.length; i++) {
      to_move[i].add(this.dir_q[i]);
      if (to_move[i].x < -width / 2) to_move[i].x = width / 2 - BOX;
      if (to_move[i].x >= (width / 2) - 1) to_move[i].x = -width / 2;
      if (to_move[i].y < -height / 2) to_move[i].y = height / 2 - BOX;
      if (to_move[i].y >= (height / 2) - 1) to_move[i].y = -height / 2;
    }
  }

  //Reset the snake and display the "GAME OVER" screen
  die() {
    background(0);
    stat = "dead";
    this.head = createVector(0, 0);
    world = [this.head];
    this.parts = [];
    this.future_part = null;
    this.dir = DOWN;
    this.dir_q = [DOWN];
  }
}


/**
 * r - Creates a random spot for a box
 *
 * @param  {Number} n Defines the range
 * @return {Number}   A random spot
 */
function r(n) {
  return floor(map(random(-1, 1), -1, 1, -n / BOX, n / BOX)) * BOX;
}