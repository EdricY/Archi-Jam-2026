const canvas = document.getElementById('canvas');
export const W = canvas.width;
export const H = 512;//canvas.height;
export const ctx = canvas.getContext('2d');
ctx.textAlign = "center";
ctx.textBaseLine = "middle";

window.mapID = -1;
window.mapData = [];
window.collisionMap = [];
window.interactionObjects = [];

export const MAPIDS = [
  "map0",
  "map1",
  "map2",
  "map3",
  "map4",
  "map5",
  "map6",
  "map7",
  "map8",
  "map9",
  "map10",
  "map11",
  "map12",
  "map13",
  "map14"
]

//math!

//returns x where min <= x < max
export function randInt(min, max) {
  let range = max - min;
  return Math.floor(min + (Math.random() * range));
}

export function shuffle(a) {
  let j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
}

export function mod(a, n) {
  return (a % n + n) % n;
}
