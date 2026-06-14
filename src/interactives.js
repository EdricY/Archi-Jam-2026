import { archiClient, location_name_to_id } from "./archi";
import { H, randInt, W } from "./gamesetup";
import { LockpickWindow } from "./lockpick";
import { addToWallet } from "./shop";
import { returnToLanding } from "./state";
import { collisionctx, floorctx, FLOORTILES, getTileFromPos, TILESIZE } from "./tiles";

const PI = Math.PI
const safe_open = document.getElementById('safe-open');
const register_open = document.getElementById('register-open');

window.onelesspin = false;

export class LockBox {
  constructor(x, y, tileID) {
    this.x = x;
    this.y = y;
    this.message = "Lockpick [Space]";
    this.done = false;

    this.kind = "safe";
    if (tileID == 21 || tileID == 30) this.kind = "register";
    if (tileID == 24 || tileID == 31 || tileID == 32 || tileID == 33) this.kind = "door";

    this.callback = () => { };
    if (tileID == 20 || tileID == 29) { // safe
      this.pins = randInt(3, 7);
      this.callback = () => {
        this.done = true;
        let locName;
        if (tileID == 20) locName = `Level ${window.mapID + 1} Chest 1`
        else locName = `Level ${window.mapID + 1} Chest 2`
        player.inventory.push(location_name_to_id[locName]);
        let r = Math.floor(y / TILESIZE);
        let c = Math.floor(x / TILESIZE);

        collisionctx.clearRect(c * TILESIZE, r * TILESIZE, TILESIZE, TILESIZE);
        collisionctx.save();
        let leftTile = getTileFromPos(mapData, x - TILESIZE, y)
        collisionctx.translate(c * TILESIZE + TILESIZE / 2, r * TILESIZE + TILESIZE / 2);
        if (!FLOORTILES.includes(leftTile)) {
          // flip 180 to open to the right side
          collisionctx.rotate(PI);
        }
        collisionctx.drawImage(safe_open, -TILESIZE / 2, -TILESIZE / 2);
        collisionctx.restore();
      };
    } else if (tileID == 21 || tileID == 30) { //register
      this.pins = randInt(3, 6);
      this.callback = () => {
        this.done = true;
        let locName;
        if (tileID == 21) locName = `Level ${window.mapID + 1} Chest 1`
        else locName = `Level ${window.mapID + 1} Chest 2`
        player.inventory.push(location_name_to_id[locName]);
        let r = Math.floor(y / TILESIZE);
        let c = Math.floor(x / TILESIZE);
        collisionctx.clearRect(c * TILESIZE, r * TILESIZE, TILESIZE, TILESIZE);
        collisionctx.drawImage(register_open, c * TILESIZE, r * TILESIZE);
      };
    } else if (tileID == 24 || tileID == 31 || tileID == 32 || tileID == 33) { // metal door
      this.pins = randInt(2, 4);
      this.callback = () => {
        this.done = true;
        let r = Math.floor(y / TILESIZE);
        let c = Math.floor(x / TILESIZE);
        collisionctx.clearRect(c * TILESIZE, r * TILESIZE, TILESIZE, TILESIZE);

        collisionMap[r][c] = recentFloorTileID;
        mapData[r][c] = recentFloorTileID;

        let raw_collision_data = collisionctx.getImageData(0, 0, W, H);
        raw_collision_data = raw_collision_data.data;
        collisionMap = [];
        for (let y = 0; y < H; y++) {
          collisionMap.push([]);
          for (let x = 0; x < W; x++) {
            let pos = 4 * (x + y * W) + 3;
            collisionMap[y].push(raw_collision_data[pos] > 0);
          }
        }
      };
    }

    if (onelesspin) this.pins--;

    this.lockpickWindow = new LockpickWindow(this.pins, this.callback);
    // this.lockpickWindow = new LockpickWindow(1, this.callback); for debug
  }

  interact() {
    lockpickWindow = this.lockpickWindow;
    lockpickWindow.active = true;
  }
}

export class Entrance {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.done = false;
    this.message = "";
    this.kind = "entrance"
    // TODO: this counts from when the entrance is created, should count from when entering the level or some other solution
    setTimeout(() => this.message = "Return Home [Space]", 10000);
  }

  interact() {
    if (window.alarm) return;
    archiClient.check(...player.inventory);
    if (player.inventory.length > 0) addToWallet(50);
    if (player.inventory.includes(location_name_to_id["Level 15 Chest 2"])) {
      archiClient.goal()
    }
    player.inventory = []
    returnToLanding();
  }
}
