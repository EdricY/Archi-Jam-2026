import { Enemy, PI, ENEMYIMGS } from "./enemy.js";
import { TILESIZE } from "./tiles";
import { PLAYERSIZE } from "./player.js";

var spawnerdebug = false;

const spawnAnimDuration = 60;

export class Spawner {
  constructor(x, y, theta = Math.PI / 2, startDelay = 100, spawnDelay = 1200, maxEnemies = 3) {
    this.theta = theta;
    this.spawnDelay = spawnDelay;
    this.spawnTimer = startDelay; // counts down
    this.x = x;
    this.y = y;
    this.numSpawned = 0;
    this.maxEnemies = maxEnemies;
  }

  draw(ctx) {
    ctx.save()
    ctx.translate(this.x, this.y);
    ctx.rotate(this.theta);
    // draw sprite
    ctx.restore();

    if (this.spawnTimer <= spawnAnimDuration) {
      let t = 1 - (this.spawnTimer / spawnAnimDuration);

      let frame = Math.floor(this.spawnTimer / 4) % ENEMYIMGS.length;
      let img = ENEMYIMGS[frame];

      let x = this.x + (Math.cos(this.theta) * TILESIZE * (2 * t - 1));
      let y = this.y + (Math.sin(this.theta) * TILESIZE * (2 * t - 1));

      ctx.save()
      ctx.translate(x, y);
      ctx.rotate(this.theta + PI / 2);
      ctx.drawImage(img, -PLAYERSIZE, -PLAYERSIZE);
      ctx.restore()
    }

    if (spawnerdebug) {
      ctx.fillStyle = "red";
      ctx.fillText(this.spawnTimer, this.x, this.y + 16);
    }
  }

  update() {
    // if (this.numSpawned >= 3) return;
    this.spawnTimer--;
    if (this.spawnTimer <= 0) {
      this.spawnEnemy();
      if (this.numSpawned < this.maxEnemies) {
        this.spawnTimer = this.spawnDelay;
      } else {
        this.spawnTimer = Infinity;
      }
    }
  }

  spawnEnemy() {
    if (this.numSpawned >= this.maxEnemies) return;
    this.numSpawned++;
    let dx = Math.cos(this.theta);
    let dy = Math.sin(this.theta);
    let px = this.x + dx * TILESIZE;
    let py = this.y + dy * TILESIZE;
    enemies.push(new Enemy(px, py, this.theta));
  }
}