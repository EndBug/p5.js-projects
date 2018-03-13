/**
 *  This is my version of this video by The Coding Train: https://youtu.be/jxGS3fKPKJA
 */

var cells = [],
  ms,
  speed = 1,
  limit = 10,
  cr = 200;

function setup() {
  createCanvas(800, 800);
  cells.push(new Cell);
  ms = millis();
  //Just a reminder for the variables' names
  console.log("Variables that you might want to change in the console:\nlimit -> defines the radius for a cell to be deleted\nspeed -> the speed at wich the cells reproduce\ncr -> the radius of the first cell");
}

function draw() {
  background(0);
  for (let cell of cells) {
    cell.update();
    cell.show();
    if (cell.tr == 0 && cell.r < limit) cell.die(); //if the cell is too small, kill it
  }
  //If there are no more cells, restart
  if (cells.length == 0) cells.push(new Cell);
  updateTime();
}

class Cell {
  constructor(x = width/2, y = height/2, r = cr, tr = cr) {
    if (x != null) {
      this.s = createVector(x, y);
      this.r = r;
      this.tr = tr;
      this.c = randomColor(200); //can be used to create different colors
      this.d = createVector(0, 0);
      this.timer = randomTimer();
    } else {
      this.r = 0;
    }
  }

  show() {
    noStroke();
    //To use colors insead of this poorly made "animal-cell-like" design, use: fill(this.c);
    fill(255, 192, 203, 200);
    ellipse(this.s.x, this.s.y, this.r*2, this.r*2);
    fill(199, 21, 133, 200);
    ellipse(this.s.x, this.s.y, this.r, this.r);
  }

  update() {
    for (let cell of cells) this.checkColl(cell);
    this.s.add(this.d);
    if (this.s.x + this.r > width) this.s.x -= (this.s.x + this.r) - width;
    else if (this.s.x - this.r < 0) this.s.x += this.r - this.s.x;
    if (this.s.y + this.r > height) this.s.y -= (this.s.y + this.r) - height;
    else if (this.s.y - this.r < 0) this.s.y += this.r - this.s.y;
    this.d.div(2);
    this.r -= (this.r - this.tr)/50;
    if (this.timer <= 0) this.mitosis();
    if (this.r < limit) this.tr = 0;
  }


  /**
   * checkColl - Checks if two cells collidem if so, it moves them
   *
   * @param {Cell} cell A cell to check
   */
  checkColl(cell) {
    let ds = p5.Vector.sub(this.s, cell.s);
    if (ds.mag() == 0) {
      let v = randomVector()
      this.d.add(v);
      cell.d.sub(v);
    } else if (ds.mag() < this.r + cell.r) {
      this.d.add(ds.copy().div(this.r*2));
      cell.d.sub(ds.copy().div(cell.r*2));
    }
  }


  //mitosis - Creates two smaller cells from the first one (the first is resized)
  mitosis() {
    this.tr *= 2/3;
    this.timer = randomTimer();
    cells.push(new Cell(this.s.x, this.s.y, this.r, this.tr));
  }


  //Deletes the cell from the array
  die() {
    cells.splice(cells.indexOf(this), 1);
  }
}

//Duplicate a random cell
function mouseClicked() {
  cells[floor(randomTimer(0, cells.length))].mitosis();
}

//Update the cells' timer
function updateTime() {
  for (let cell of cells) cell.timer -= (millis() - ms)*speed;
  ms = millis();
}

//Returns a random vector
function randomVector(mag = 1) {
  let x = random(-1, 1);
  let y = random(-1, 1);
  return createVector(x, y).normalize().mult(mag);
}
//Returns a random timer in milliseconds
function randomTimer(min = 5000, max = 30000) {
  return floor(random(min, max));
}
//Guess what? It returns a random color
function randomColor(alpha = 256) {
  let r = random(0, 256);
  let g = random(0, 256);
  let b = random(0, 256);
  return color(r, g, b, alpha);
}
