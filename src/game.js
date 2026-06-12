
import { PI } from "./ai.js";
import { play_background_music, stop_background_music } from "./audio.js";
import { ctx, H, randInt, W } from "./gamesetup.js";
import { Player, Point } from "./player.js";
import { gameState } from "./state.js";
import { Particles } from "./particles.js";
import { drawHUD } from "./hud.js";
import { TILESIZE } from "./tiles.js";
import { getSlidePixelsGenerator } from "./slide.js";

const UPDATES_PER_SEC = 60;
const MS_PER_UPDATE = 1000 / UPDATES_PER_SEC;
let lastTime = Date.now();
let lag = 0;
let redraw = false;


window.player = new Player(0, 0);
window.lockpickWindow = null;

export function gameInit() {
  play_background_music();
  // setMapData("map3");
}

// gameInit();

window.debugCtx = new OffscreenCanvas(W, H).getContext("2d")

export function gameDraw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(floorCanvas, 0, 0);
  ctx.drawImage(collisionCanvas, 0, 0);
  player.draw(ctx);
  Particles.draw(ctx, 0);
  for (let en of enemies) {
    en.draw(ctx);
  }
  if (window.spawner) {
    window.spawner.draw(ctx);
  }
  ctx.fillStyle = "yellow";
  // ctx.fillText(player.theta, 100,10);
  if (lockpickWindow) lockpickWindow.draw(ctx);

  drawHUD(ctx);



  // DEBUG
  // ctx.drawImage(debugCtx.canvas, 0, 0)

  // ctx.fillStyle = "rgba(255, 0, 0, .2)";
  // let en = enemies[0]
  // // let thetas = [en.theta - PI / 8, en.theta - PI / 16, en.theta, en.theta + PI / 16, en.theta + PI / 8]
  // let thetas = [en.theta]
  // ctx.beginPath();
  // ctx.moveTo(en.x, en.y);
  // for (let theta of thetas) {
  //   let generator = getSlidePixelsGenerator(en.x, en.y, theta)
  //   let pt = null;
  //   while (true) {
  //     pt = generator.next().value.alignedPt;
  //     if (!pt) break;
  //     if (pt.x < 0 || pt.x >= W || pt.y < 0 || pt.y >= H) break;
  //     if (collisionMap[pt.y][pt.x]) {
  //       break;
  //     };
  //   }
  //   ctx.lineTo(pt.x, pt.y);
  // }
  // ctx.closePath();
  // ctx.stroke();

  // for (let r = 0; r < collisionMap.length; r++) {
  //   for (let c = 0; c < collisionMap[r].length; c++) {
  //     if (en.withinVisibility(new Point(c, r))) {
  //       ctx.fillRect(c, r, 1, 1);
  //     }
  //   }
  // }

  // if (en.withinVisibility()) {
  //   ctx.fillText("VISIBLE", 10, 50);
  // }
  // ctx.font = "14px serif";
  // ctx.fillText(`Player: (${player.x}, ${player.y})`, 10, 20);
}

export function gameUpdate() {
  Particles.update();
  player.update();

  let len = enemies.length;
  for (let i = 0; i < len; i++) {
    enemies[i].update();
  }

  if (alarm > 0) alarm--;
  else alarm = 0;

  if (lockpickWindow) lockpickWindow.update();
  if (window.spawner) window.spawner.update();
  lastKeys = JSON.parse(JSON.stringify(keys)); //deep copy
}

function tick() {
  let current = Date.now();
  let elapsed = current - lastTime;
  lastTime = current;
  lag += elapsed;
  while (lag >= MS_PER_UPDATE) {
    gameState.update();
    lag -= MS_PER_UPDATE;
    redraw = true;
  }
  if (redraw) {
    gameState.draw();
    redraw = false;
  }
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);
