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

/*const map = [[0,0], [0,1]];*/

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

const player = new Player();

function clearScreen() {
  ctx.fillStyle = 'red';
  ctx.fillRect(0, 0, scwidth, scheight);
}

function getHCollision(angle) {
  let up = Math.abs(Math.floor(angle / Math.PI) % 2);

  let ynearest = up
    ? Math.floor(player.y / cellsize) * cellsize 
    : Math.floor(player.y / cellsize) * cellsize + cellsize;

  let xnearest = player.x + (ynearest - player.y) / Math.tan(angle);

  let dy = up ? -cellsize: cellsize;
  let dx = dy / Math.tan(angle);

  let [nextx, nexty] = [xnearest, ynearest];

  let wall;

  while(!wall) {
    let celly = up ? Math.floor(nexty / cellsize) - 1 : Math.floor(nexty / cellsize);
    let cellx = Math.floor(nextx / cellsize);

    if(outofMap(cellx, celly)) {
      break;
    }

    wall = map[celly][cellx];
    
    if(!wall) {
      nextx += dx; 
      nexty += dy;
    }
  }

  return {
    vertical:false,
    distance: distance(player.x, player.y, nextx, nexty),
    angle,
  };
}

function getVCollision(angle) {
  let right = Math.abs(Math.floor((angle - Math.PI/2) / Math.PI) % 2);

  let xnearest = right 
    ? Math.floor(player.x / cellsize) * cellsize + cellsize 
    : Math.floor(player.x / cellsize) * cellsize;

  let ynearest = player.y + Math.tan(angle) * (xnearest - player.x);

  let dx = right ? cellsize: -cellsize;
  let dy = Math.tan(angle) * dx;

  let [nextx, nexty] = [xnearest, ynearest];

  let wall;

  while(!wall) {
    let cellx = right ? Math.floor(nextx / cellsize) : Math.floor(nextx / cellsize) - 1;
    let celly = Math.floor(nexty / cellsize);

    if(outofMap(cellx, celly)) {
      break;
    }

    wall = map[celly][cellx];
    
    if(!wall) {
      nextx += dx; 
      nexty += dy;
    }
  }

  return {
    vertical:true,
    distance: distance(player.x, player.y, nextx, nexty),
    angle,
  };
}

function castRay(angle) {
  let vcollide = getVCollision(angle);
  let hcollide = getHCollision(angle);

  return hcollide.distance >= vcollide.distance ? vcollide : hcollide;
}

function getRays() {
  let initangle = player.angle - fov/2;
  let numrays = scwidth;
  let anglestep = fov / numrays;

  return Array.from({length : numrays}, (_, i) => {
    return castRay(initangle + i * anglestep);
  });
} 

function renderMinimap(posx, posy, rays, scale=0.75) {
  let csize = cellsize * scale;

	map.forEach((row, y) => {
		row.forEach((cell, x) => {
			ctx.fillStyle = cell ? '#999' : '#000'; 
			ctx.fillRect(posx+(x*csize), posy+(y*csize), csize, csize);
		})
	});

  player.show(posx, posy, scale);
  
  ctx.strokeStyle = colors.rays;
  rays.forEach((ray, r) => { 
    ctx.beginPath();
    ctx.moveTo(player.x * scale, player.y * scale);
    ctx.lineTo(
      (player.x + Math.cos(ray.angle) * ray.distance) * scale, 
      (player.y + Math.sin(ray.angle) * ray.distance) * scale
    );
    ctx.closePath();
    ctx.stroke();
  });
}

function gameLoop() {
  clearScreen();
  let rays = getRays();
  player.move();
  renderMinimap(0, 0, rays);
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

















