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

const csize = 24;

//utility funcions

function toRadians(deg) {
  return (deg * Math.PI) / 180;
}

function distance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

const canvas = document.createElement("canvas");
canvas.setAttribute("width", scwidth);
canvas.setAttribute("height", scheight);
document.getElementById("wrap").appendChild(canvas);

const ctx = canvas.getContext('2d');

function renderMinimap(posx, posy, scale=0) {
	map.forEach((row, y) => {
		row.forEach((cell, x) => {
			ctx.fillStyle = cell ? '#999' : '#000'; 
			ctx.fillRect(posx+(x*csize), posy+(y*csize), csize, csize);
		})
	})
}

function gameLoop() {
	renderMinimap(0, 0);
}

setInterval(gameLoop, tick);



















