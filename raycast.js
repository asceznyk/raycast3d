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
    this.color = '#3D5A80';
  }

  move () {
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;
  }

  show(posx, posy, scale) {
    ctx.fillStyle = this.color;
    ctx.fillRect(posx + this.x * scale - 10/2, posy + this.y * scale - 10/2, 10, 10);
  
    ctx.strokeStyle = this.color;
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
  floor: "#8C4F47",   
  ceiling: "#EE6C4D", 
  darkwall: "#98C1D9", 
  lightwall: "#BCDEEB",
  rays: "#EE6C4D",
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
			ctx.fillStyle = cell ? colors.lightwall : colors.floor; 
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


function fixFishEye(distance, rangle, pangle) {
  return distance * Math.cos(rangle - pangle);
}

function renderScene(rays) {
  rays.forEach((ray, r) => {
    let distance = fixFishEye(ray.distance, ray.angle, player.angle);
    let wallheight = ((cellsize * 4.2) / distance) * 250;
    ctx.fillStyle = ray.vertical ? colors.lightwall : colors.darkwall;
    ctx.fillRect(r, (scheight - wallheight)/2, 1, wallheight);
    
    ctx.fillStyle = colors.floor;
    ctx.fillRect(
      r, 
      (scheight + wallheight)/2, 
      1, 
      (scheight - wallheight)/2
    );

    ctx.fillStyle = colors.ceiling;
    ctx.fillRect(r, 0, 1, (scheight - wallheight)/2);
  });
}

function gameLoop() {
  clearScreen();
  let rays = getRays();
  player.move();
  renderScene(rays);
  renderMinimap(0, 0, rays);
}

setInterval(gameLoop, tick);

canvas.addEventListener("click", () => {
  canvas.requestPointerLock();
});

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


