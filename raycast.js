//first some utility functions

function toRadians(deg) {
  return (deg * Math.PI) / 180;
}

function distance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
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

const canvas = document.createElement("canvas");
canvas.setAttribute("width", scwidth);
canvas.setAttribute("height", scheight);
document.getElementById("wrap").appendChild(canvas);

const ctx = canvas.getContext('2d');

class Player {
  constructor() {
    this.x = cellsize * 1.5;
    this.y = cellsize * 2;
    this.angle = 0;
    this.speed = 0;
  }
}

const player = new Player();

function renderMinimap(posx, posy, scale=0.75) {
  let csize = cellsize * scale;

	map.forEach((row, y) => {
		row.forEach((cell, x) => {
			ctx.fillStyle = cell ? '#999' : '#000'; 
			ctx.fillRect(posx+(x*csize), posy+(y*csize), csize, csize);
		})
	});

  ctx.fillStyle = 'blue';
  ctx.fillRect(posx + player.x * scale - 10/2, posy + player.y * scale - 10/2, 10, 10);
}

function gameLoop() {
	renderMinimap(0, 0);
}

setInterval(gameLoop, tick);



















