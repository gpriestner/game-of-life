const xDimension = 150;
const yDimension = 150;
var mouseX = 0;
let mouseY = 0;
let cellWidth = 0;
let cellHeight = 0;

let grid1 = [];
let grid2 = [];

const cv = document.getElementById("cv");
const grid = cv.getContext("2d");
initGrids();

resizeCanvas();
addEventListener("resize", resizeCanvas);
addEventListener("mousemove", mouseMove);
addEventListener("mouseup", mouseUp);

function resizeCanvas() {
  // console.log("resize. . . ");
  cv.height = window.innerHeight;
  cv.width = window.innerWidth;
  cellWidth = window.innerWidth / xDimension;
  cellHeight = window.innerHeight / yDimension;
  draw();
}

function mouseMove(e) {
  mouseX = e.offsetX;
  mouseY = e.offsetY;
  // console.log(`X:${mouseX}  Y:${mouseY}`);
}

function mouseUp(e) {
  // console.log(`X:${mouseX}  Y:${mouseY} B:${e.button}`);
  const x = Math.floor(mouseX / cellWidth);
  const y = Math.floor(mouseY / cellHeight);
  if (e.button == 0) {
    // console.log(`X:${x}  Y:${y}`);
    grid1[x][y] = !grid1[x][y];
    draw();
  } else if (e.button == 2) {
    animate();
  } else if (e.button == 1) {
    console.log(getLiveNeighbours(x, y));
  }
}

function generate() {
  for (let x = 0; x < xDimension; ++x) {
    for (let y = 0; y < yDimension; ++y) {
      updateCell(x, y);
    }
  }
  swapGrids();
  draw();
}

function initGrids() {
  for (let y = 0; y < yDimension; ++y) {
    grid1.push(new Array(xDimension));
    grid2.push(new Array(xDimension));
  }
}

function newGrid() {
  const g = [];
  for (let y = 0; y < yDimension; ++y) {
    g.push(new Array(xDimension));
  }
  return g;
}

function swapGrids() {
  // const temp = grid1;
  grid1 = grid2;
  grid2 = newGrid();
}

function draw() {
  grid.strokeStyle = "white";
  grid.clearRect(0, 0, cv.width, cv.height);

  //   for (let x = 0; x < cv.width; x += cellWidth) {
  //     grid.moveTo(x, 0);
  //     grid.lineTo(x, cv.height);
  //   }
  //   for (let y = 0; y < cv.height; y += cellHeight) {
  //     grid.moveTo(0, y);
  //     grid.lineTo(cv.width, y);
  //   }
  //   grid.stroke();

  // draw grid1
  grid.fillStyle = "white";
  for (let y = 0; y < yDimension; ++y) {
    for (let x = 0; x < xDimension; ++x) {
      if (grid1[x][y] === true) {
        grid.fillRect(
          x * cellWidth + 2,
          y * cellHeight + 2,
          cellWidth - 4,
          cellHeight - 4
        );
      }
    }
  }
}

function animate(ts) {
  requestAnimationFrame(animate);
  generate();
}

// animate();

function updateCell(x, y) {
  const liveNeighbours = getLiveNeighbours(x, y);
  if (grid1[x][y] === true) {
    // Any live cell with two or three live neighbours survives
    if (liveNeighbours == 2 || liveNeighbours == 3) grid2[x][y] = true;
    else grid2[x][y] = false;
  } else {
    // Any dead cell with three live neighbours becomes a live cell
    if (liveNeighbours == 3) grid2[x][y] = true;
    else grid2[x][y] = false;
  }
}

function getLiveNeighbours(x, y) {
  let count = 0;
  if (x - 1 >= 0 && y - 1 >= 0 && grid1[x - 1][y - 1] === true) ++count;
  if (y - 1 >= 0 && grid1[x][y - 1] === true) ++count;
  if (x + 1 < xDimension && y - 1 >= 0 && grid1[x + 1][y - 1] === true) ++count;

  if (x - 1 >= 0 && grid1[x - 1][y] === true) ++count;
  if (x + 1 < xDimension && grid1[x + 1][y] === true) ++count;

  if (x - 1 >= 0 && y + 1 < yDimension && grid1[x - 1][y + 1] === true) ++count;
  if (y + 1 < yDimension && grid1[x][y + 1] === true) ++count;
  if (x + 1 < xDimension && y + 1 < yDimension && grid1[x + 1][y + 1] === true)
    ++count;

  // console.log(`x:${x}  y:${y}  c:${count}`);
  return count;
}
