//first some utility functions

function toRadians(deg) {
  return (deg * Math.PI) / 180;
}

function distance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function outofMap(x, y) {
  return x < 0 || x >= map[0].length || y < 0 || y >= map.length;
}

const map = [
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 0, 1, 0, 0, 1],
  [1, 0, 1, 0, 1, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1],
];


const tick = 30;

const scwidth = window.innerWidth;
const scheight = window.innerHeight;

const cellsize = 32;

const fov = toRadians(60);

const canvas = document.createElement("canvas");
canvas.setAttribute("width", scwidth);
canvas.setAttribute("height", scheight);
document.getElementById("wrap").appendChild(canvas);

const ctx = canvas.getContext('2d');

const colors = {
  floor: "#d52b1e", // "#ff6361"
  ceiling: "#ffa975", //"#ffffff", // "#012975",
  darkwall: "#013aa6", // "#58508d"
  lightwall: "#012975", // "#003f5c"
  rays: "#ffa600"
}

class Player {
  constructor() {
    this.x = cellsize * 1.5;
    this.y = cellsize * 2;
    this.angle = 0;
    this.speed = 0;
  }

  move () {
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;
  }

  show(posx, posy, scale) {
    ctx.fillStyle = 'blue';
    ctx.fillRect(posx + this.x * scale - 10/2, posy + this.y * scale - 10/2, 10, 10);
  
    ctx.strokeStyle = 'blue';
    ctx.beginPath();
    ctx.moveTo(this.x * scale, this.y * scale);
    ctx.lineTo(
      (this.x + Math.cos(this.angle) * 20) * scale, 
      (this.y + Math.sin(this.angle) * 20) * scale
    );
    ctx.closePath();
    ctx.stroke();
  }
}

const player = new Player();

function clearScreen() {
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, scwidth, scheight);
}

function renderMinimap(posx, posy, scale=0.75) {
  let csize = cellsize * scale;

	map.forEach((row, y) => {
		row.forEach((cell, x) => {
			ctx.fillStyle = cell ? '#999' : '#000'; 
			ctx.fillRect(posx+(x*csize), posy+(y*csize), csize, csize);
		})
	});

  player.show(posx, posy, scale);

}

function gameLoop() {
  clearScreen();
  player.move();
  renderMinimap(0, 0);
}

setInterval(gameLoop, tick);

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") {
    player.speed = 2;
  }
  if (e.key === "ArrowDown") {
    player.speed = -2;
  }
});

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowUp" || e.key === "ArrowDown") {
    player.speed = 0;
  }
});

document.addEventListener("mousemove", function (event) {
  player.angle += toRadians(event.movementX);
});

















