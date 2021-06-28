const map = [
	[1, 1, 1, 1, 1, 1, 1]
	[1, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 0, 1, 1],
  [1, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1],
  [1, 1, 1, 1, 1, 1, 1],
];

const scwidth = window.innerWidth;
const scheight = window.innerHeight;

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
document.getElementByID("wrap").appendChild(canvas);
