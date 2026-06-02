import { H, W } from "./gamesetup";
import { returnToLanding } from "./state";
import { getTileFromPos } from "./tiles";


const PI = Math.PI
export const PLAYERSIZE = 16;
export const PLAYERHALFSIZE = PLAYERSIZE / 2;
export const PHSZ = PLAYERHALFSIZE;
export const SQRT2 = Math.sqrt(2);

export const UP = "ArrowUp"
export const DOWN = "ArrowDown"
export const LEFT = "ArrowLeft"
export const RIGHT = "ArrowRight"

export const PLAYERIMGS = [
  document.getElementById("player_0"),
  document.getElementById("player_1"),
  document.getElementById("player_2"),
  document.getElementById("player_3")
]

export const PLAYERBAGIMGS = [
  document.getElementById("player_bag_0"),
  document.getElementById("player_bag_1"),
  document.getElementById("player_bag_2"),
  document.getElementById("player_bag_3")
]

const playerCanvas = document.getElementById("playerCanvas");
const playerctx = playerCanvas.getContext('2d');

window.maxHealth = 100;
window.maxStamina = 120;

export class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.health = maxHealth;
    this.deathTimer = 120;
    this.stamina = maxStamina;
    this.speed = 4;
    this.basespeed = 4;
    this.speedy = false;
    this.stealthy = false;
    this.stealthTimer = 0;
    this.animationFrame = 0;
    this.inventory = 0;
    this.theta = 0;
    this.message = "";
    this.actionTarget = null;
  }
  draw(ctx) {

    drawPlayer(ctx, this);
  }
  update() {
    if (player.health <= 0) {
      this.deathTimer--;
      if (this.deathTimer <= 0) {
        returnToLanding();
      }
      return;
    }
    if (lockpickWindow && lockpickWindow.active) {
      this.stamina += .2;
      if (this.stamina > maxStamina) {
        this.stamina = maxStamina;
      }
      return;
    }
    if ((keys["z"] || keys["Shift"]) && this.stamina > 0) {
      this.speedy = true;
      this.speed = this.basespeed * 1.5;
      // this.stamina--;
    } else {
      this.speedy = false;
      this.speed = this.basespeed;
    }

    if ((keys['x'] || keys["Control"]) && this.stamina > 0) {
      this.stealthy = true;
      this.stealthTimer++;
      this.stamina--;
      this.animationFrame = 0;
      return;
    } else {
      this.stealthy = false;
      this.stealthTimer = 0;
    }

    if (!this.speedy) {
      this.stamina += .2;
      if (this.stamina > maxStamina) {
        this.stamina = maxStamina;
      }
    }

    if (keys[UP] || keys["w"]) {
      this.vy = -this.speed;
    } else if (keys[DOWN] || keys["s"]) {
      this.vy = this.speed;
    } else {
      this.vy = 0;
    }
    if (keys[LEFT] || keys["a"]) {
      this.vx = -this.speed;
    } else if (keys[RIGHT] || keys["d"]) {
      this.vx = this.speed;
    } else {
      this.vx = 0;
    }

    //do animation
    if (this.vy == 0 && this.vx == 0) {
      this.animationFrame = 0;
    } else {
      this.theta = Math.atan2(this.vy, this.vx);
      this.animationFrame += .2;
      if (this.animationFrame >= 4) {
        this.animationFrame = 0;
      }

      if (this.speedy) this.stamina--;
    }

    if (this.vy != 0 && this.vx != 0) {
      this.vy /= SQRT2;
      this.vx /= SQRT2;
    }

    // this.x += this.vx;
    // this.y += this.vy;
    if (this.vy >= 0) { //moving down
      let y_cls = findYCollisionDown(this.y - PHSZ, this.vy, this.x - PHSZ, PLAYERSIZE, PLAYERSIZE);
      if (y_cls == null) {
        this.y += this.vy;
      } else { //landed on something
        this.vy = 0;
        this.y = y_cls.y + PHSZ;
      }
    } else { //moving up
      let y_cls = findYCollisionUp(this.y - PHSZ, this.vy, this.x - PHSZ, PLAYERSIZE, PLAYERSIZE);
      this.midair = true;
      if (y_cls == null) {
        this.y += this.vy;
      } else { //hit your head
        this.vy = 0;
        this.y = y_cls.y + PHSZ;
      }
    }

    if (this.vx > 0) { //moving right
      let x_cls = findXCollisionRight(this.x - PHSZ, this.vx, this.y - PHSZ, PLAYERSIZE, PLAYERSIZE);
      if (x_cls == null) this.x += this.vx;
      else { //hit wall
        this.vx = 0;
        this.x = x_cls.x + PHSZ;
      }
    } else if (this.vx < 0) { //moving left
      let x_cls = findXCollisionLeft(this.x - PHSZ, this.vx, this.y - PHSZ, PLAYERSIZE, PLAYERSIZE);
      if (x_cls == null) this.x += this.vx;
      else { //hit wall
        this.vx = 0;
        this.x = x_cls.x + PHSZ;
      }
    }

    //interactions
    // if (this.inventory) return;
    this.actionTarget = closestInteractionObject(this);
    if (this.actionTarget) {
      this.message = this.actionTarget.message;
      if (keys[" "] && !lastKeys[" "]) {
        this.message = "";
        this.actionTarget.interact();
      }
    } else {
      this.message = "";
    }
  }
}

function drawPlayer(ctx, player) {
  if (player.health <= 0) return;
  let f_x = Math.round(player.x)
  let f_y = Math.round(player.y)
  let left = f_x - PLAYERSIZE; //awkward
  let top = f_y - PLAYERSIZE;
  // ctx.fillRect(left, top, PLAYERSIZE, PLAYERSIZE);
  let frame = Math.floor(player.animationFrame);
  let img = PLAYERIMGS[frame];
  let rotation = player.theta + PI / 2;
  if (player.inventory) img = PLAYERBAGIMGS[frame];

  if (player.speedy) {
    playerctx.save();
    playerctx.globalAlpha = .3;
    playerctx.globalCompositeOperation = 'source-atop';
    playerctx.drawImage(floorCanvas, 0, 0);
    playerctx.drawImage(collisionCanvas, 0, 0);
    playerctx.restore();
  } else {
    playerctx.clearRect(0, 0, W, H)
  }
  playerctx.translate(f_x, f_y);
  playerctx.rotate(rotation);
  playerctx.drawImage(img, -PLAYERSIZE, -PLAYERSIZE);
  playerctx.resetTransform();

  if (player.stealthy) {
    playerctx.globalAlpha = Math.min(player.stealthTimer / 50, .6);
    playerctx.globalCompositeOperation = 'source-atop';
    playerctx.drawImage(floorCanvas, 0, 0);
    playerctx.drawImage(collisionCanvas, 0, 0);
    playerctx.globalAlpha = 1;
    playerctx.globalCompositeOperation = 'source-over';
  }
  ctx.drawImage(playerCanvas, 0, 0)


  ctx.fillStyle = "black"
  ctx.font = "14px serif"
  ctx.fillText(player.message, f_x, f_y - PLAYERSIZE)
}

function getLocalTiles(player) {
  tl = getTileFromPos(mapData, player.x - PHSZ, player.y - PHSZ);
  tr = getTileFromPos(mapData, player.x + PHSZ - 1, player.y - PHSZ);
  bl = getTileFromPos(mapData, player.x - PHSZ, player.y + PHSZ - 1);
  br = getTileFromPos(mapData, player.x + PHSZ - 1, player.y + PHSZ - 1);
  return [tl, tr, bl, br];
}

function closestInteractionObject(player, reach = 32) {
  let mindist = 1000000000;
  let closest = null;
  let len = interactionObjects.length;
  for (let i = 0; i < len; i++) {
    if (interactionObjects[i].done) continue;
    let dx = interactionObjects[i].x - player.x;
    let dy = interactionObjects[i].y - player.y;
    let dist = dx * dx + dy * dy;
    if (dist < mindist) {
      mindist = dist;
      closest = interactionObjects[i];
    }
  }
  if (mindist > reach * reach) return null;
  return closest;
}

// collision stuff

/* returns Point(x,y)
 * y: suggested relocation
 * x: collision position
 */
export function findYCollisionDown(y, vy, x, width, height) {
  vy = Math.ceil(vy);
  if (vy <= 0) return null;
  y = Math.floor(y);
  x = Math.floor(x);
  let bottom = y + height
  for (let r = bottom; r < bottom + vy; r++) {
    if (r >= H) return new Point(x, H - height);
    for (let c = x; c < x + width; c++) {
      if (collisionMap[r][c]) {
        return new Point(c, r - height);
      }
    }
  }
  return null;
}
export function findYCollisionUp(y, vy, x, width, height) {
  vy = Math.floor(vy);
  if (vy >= 0) return null;
  y = Math.floor(y);
  x = Math.floor(x);
  for (let r = y - 1; r > y + vy - 1; r--) {
    if (r <= 0) return new Point(x, 0);
    for (let c = x; c < x + width; c++) {
      if (collisionMap[r][c]) {
        return new Point(c, r + 1);
      }
    }
  }
  return null;
}
/* returns Point(x,y)
* y: collision position
* x: suggested relocation
*/
export function findXCollisionRight(x, vx, y, width, height) {
  vx = Math.ceil(vx);
  if (vx <= 0) return null;
  x = Math.floor(x);
  y = Math.floor(y);
  let right = x + width;
  for (let c = right; c < right + vx; c++) {
    if (c >= W) return new Point(c - width, y); //right edge
    for (let r = y; r < y + height; r++) {
      if (collisionMap[r][c]) {
        return new Point(c - width, r);
      }
    }
  }
  return null
}
export function findXCollisionLeft(x, vx, y, width, height) {
  vx = Math.floor(vx);
  if (vx >= 0) return null;
  x = Math.floor(x);
  y = Math.floor(y);
  for (let c = x - 1; c > x + vx - 1; c--) {
    if (c <= 0) return new Point(0, y); //left edge
    for (let r = y; r < y + height; r++) {
      if (collisionMap[r][c]) {
        return new Point(c + 1, r);
      }
    }
  }
  return null;
}

export class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
