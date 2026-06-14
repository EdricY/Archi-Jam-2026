import { archiClient } from "./archi";
import { H, W } from "./gamesetup";
import { PLAYERSIZE } from "./player";

export function drawHUD(ctx) {
  ctx.font = "14px serif"
  ctx.fillStyle = "#444";
  ctx.fillRect(0, H + 1, W, 64);
  // width 20 margin 8

  //stamina
  ctx.strokeStyle = "black";
  ctx.strokeRect(50, 512 + 4, maxStamina, 15)
  ctx.fillStyle = "yellow";
  ctx.fillRect(50, 512 + 4, Math.round(player.stamina), 15)
  ctx.fillStyle = "white";
  ctx.fillText("SP", 30, 512 + 4 + 10)


  //health
  ctx.strokeRect(50, 512 + 8 + 15, maxHealth, 15)
  ctx.fillStyle = "red";
  let hp = Math.max(Math.round(player.health), 0);
  ctx.fillRect(50, 512 + 8 + 15, hp, 15)
  ctx.fillStyle = "white";
  ctx.fillText("HP", 30, 512 + 8 + 15 + 10)

  //alarm
  ctx.strokeRect(50, 512 + 12 + 30, alarmTime / 5, 15)
  ctx.fillStyle = "orange";
  ctx.fillRect(50, 512 + 12 + 30, Math.round(alarm / 5), 15)
  ctx.fillStyle = "white";
  ctx.fillText("!", 30, 512 + 12 + 30 + 10)

  ctx.fillText(`Holding: ${player.inventory.length > 0 ? getInventoryString() : "Nothing"}`, 400, 512 + 12 + 15)

  // ctx.strokeRect(W - 10 - alarmTime/5, 536, alarmTime/5, 15)
  // ctx.fillStyle = "red";
  // ctx.fillRect(W - 10 - alarm/5, 536, Math.round(alarm/5), 15)

  if (player.message && player.actionTarget) {
    ctx.fillStyle = "black"
    ctx.font = "14px serif"
    ctx.fillText(player.message, Math.round(player.actionTarget?.x), Math.round(player.actionTarget?.y) - PLAYERSIZE)
  }
}

export const scoutDict = new Map();
// undefined => not in dict, false => scouting, string => scouted value
export function getInventoryString() {
  let s = ""
  let first = true;
  for (let inv of player.inventory) {
    if (first) {
      first = false;
    } else {
      s += ", "
    }

    if (scoutDict.get(inv) == undefined) {
      scoutDict.set(inv, false);
      archiClient.scout([inv]).then((scout_items) => {
        scoutDict.set(inv, scout_items[0]?.name ?? "Unknown");
      })
    } else if (scoutDict.get(inv) == false) {
      s += "Unknown"
    } else {
      s += scoutDict.get(inv)
    }
  }
  return s
}

