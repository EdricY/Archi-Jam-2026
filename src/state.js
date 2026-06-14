import { archiClient, hasItem } from "./archi";
import { stop_background_music } from "./audio";
import { gameDraw, gameInit, gameUpdate } from "./game";
import { MAPIDS } from "./gamesetup";
import { Entrance } from "./interactives";
import { Player } from "./player";
import { addToWallet, loadWallet } from "./shop";
import { setMapData } from "./tiles";
import { Client } from "archipelago.js";

const canvasContainer = document.getElementById('canvasContainer');
const menuDiv = document.getElementById('menuDiv');
const landingDiv = document.getElementById('landingDiv');
const instructionsDiv = document.getElementById('instructionsDiv');
const upgradesDiv = document.getElementById('upgradesDiv');
const creditsDiv = document.getElementById('creditsDiv');
const TILE_OFFSET = 16;

export const PLAYER_SPAWN_LOCATIONS = {
  0: { x: 24 * TILE_OFFSET, y: 30 * TILE_OFFSET },
  1: { x: 46 * TILE_OFFSET, y: 16 * TILE_OFFSET },
  2: { x: 42 * TILE_OFFSET, y: 2 * TILE_OFFSET },
  3: { x: 1 * TILE_OFFSET, y: 16 * TILE_OFFSET },
  4: { x: 24 * TILE_OFFSET, y: 30 * TILE_OFFSET },
  5: { x: 24 * TILE_OFFSET, y: 2 * TILE_OFFSET },
  6: { x: 24 * TILE_OFFSET, y: 30 * TILE_OFFSET },
  7: { x: 1 * TILE_OFFSET, y: 16 * TILE_OFFSET },
  8: { x: 1 * TILE_OFFSET, y: 16 * TILE_OFFSET },
  9: { x: 1 * TILE_OFFSET, y: 16 * TILE_OFFSET },
  10: { x: 24 * TILE_OFFSET, y: 1 * TILE_OFFSET },
  11: { x: 1 * TILE_OFFSET, y: 16 * TILE_OFFSET },
  12: { x: 4 * TILE_OFFSET, y: 30 * TILE_OFFSET },
  13: { x: 1 * TILE_OFFSET, y: 16 * TILE_OFFSET },
  14: { x: 1 * TILE_OFFSET, y: 28 * TILE_OFFSET },
};

export const gameState = {
  MENU: 0, GAME: 1, TRANSITION: 2,
  state: 0,
  update: function () { },
  draw: function () { },
  hideAll: function () {
    canvasContainer.classList.add("nodisplay");
    landingDiv.classList.add("nodisplay");
    menuDiv.classList.add("nodisplay");
    instructionsDiv.classList.add("nodisplay");
    upgradesDiv.classList.add("nodisplay");
    creditsDiv.classList.add("nodisplay");
  }
}

const playButton = document.getElementById("playButton");
const instructionsButton = document.getElementById("instructionsButton");
const instructionBackButton = document.getElementById("instructionBackButton");
const creditsButton = document.getElementById("creditsButton");
const goBtn = document.getElementById("goBtn");
const landingMenuButton = document.getElementById("landingMenuButton");
const landingUpgradesButton = document.getElementById("landingUpgradesButton");
const creditsBackButton = document.getElementById("creditsBackButton");
const shopBackButton = document.getElementById("shopBackButton");

playButton.onclick = handlePlayButtonClicked;
instructionsButton.onclick = showInstructions;
creditsButton.onclick = showCredits;
goBtn.onclick = showGame;
instructionBackButton.onclick = showMenu;
landingMenuButton.onclick = showMenu;
landingUpgradesButton.onclick = showUpgrades;
creditsBackButton.onclick = showMenu;
shopBackButton.onclick = showLanding;



function handlePlayButtonClicked() {
  const hostInput = document.getElementById("hostInput");
  const portInput = document.getElementById("portInput");
  const passwordInput = document.getElementById("passwordInput");
  const slotInput = document.getElementById("slotNameInput");
  archiClient.login(hostInput.value + ":" + portInput.value, slotInput.value, "HeistJam", { tags: ["AP"], password: passwordInput.value })
    .then(() => {
      console.log("Connected to the Archipelago server!")
      console.log("room seed:" + archiClient.room.seedName)
      loadWallet()
      archiClient.items.on("itemsReceived", (items) => {
        for (let item of items) {
          console.log(`Received item: ${item.name} from ${item.sender.name}`);
          if (item.name == "Filler: $200") {
            addToWallet(200);
          }
        }
      });
      showLanding();
    })
    .catch((error) => {
      console.error(error);
      alert(error)
    });
}

function showLanding() {
  gameState.hideAll();
  landingDiv.classList.remove("nodisplay")

  setTimeout(() => {
    for (let worldNum of [2, 3, 4, 5]) {
      let w = document.getElementById("world-" + worldNum)
      w.classList.remove("locked")
      w.classList.remove("unlocked")
      if (hasItem("World " + worldNum + " Key")) {
        w.classList.add("unlocked")
      } else {
        w.classList.add("locked")
      }
    }
  }, 200)
}

export function showMenu() {
  gameState.hideAll();
  menuDiv.classList.remove("nodisplay")
}

export function showInstructions() {
  gameState.hideAll();
  instructionsDiv.classList.remove("nodisplay")
}

export function showCredits() {
  gameState.hideAll();
  creditsDiv.classList.remove("nodisplay");
}

export function showUpgrades() {
  gameState.hideAll();
  upgradesDiv.classList.remove("nodisplay")
  document.getElementById("wallet").innerHTML = window.walletAmt;
  shopMessage.innerHTML = "Welcome to the shop!";
}

export function showGame() {
  gameState.hideAll();
  canvasContainer.classList.remove("nodisplay");
  gameState.state = gameState.GAME;
  gameInit();
  gameState.update = gameUpdate;
  gameState.draw = gameDraw;
}

const levelSquares = document.getElementById('levelSquares');
const preview = document.getElementById('preview');
const previewctx = preview.getContext('2d');

// for (let mapID of MAPIDS) {
//   addLevelSquare(mapID);
// }

// function addLevelSquare(mapID) {
//   let sq = createLevelSquare(mapID);
//   if (sq) levelSquares.appendChild(sq);
// }

for (let mapID of MAPIDS) {
  let divID = mapID + "-div";
  let sq = document.getElementById(divID)
  sq.onclick = e => squareonclick(e, mapID);
}

// function createLevelSquare(mapID) {
//   let sq = document.createElement('div');
//   sq.classList.add('square');
//   sq.id = mapID + "-div"
//   sq.onclick = e => squareonclick(e, mapID);
//   let sqInner = document.createElement('div');
//   sqInner.innerHTML = levelSquares.children.length + 1;
//   sq.appendChild(sqInner);
//   return sq;
// }

function squareonclick(e, mapID) {
  goBtn.disabled = true;
  setTimeout(() => {
    setMapData(mapID);
    previewctx.drawImage(floorCanvas, 0, 0);
    previewctx.drawImage(collisionCanvas, 0, 0);
    player = new Player(PLAYER_SPAWN_LOCATIONS[window.mapID].x, PLAYER_SPAWN_LOCATIONS[window.mapID].y);
    interactionObjects.push(new Entrance(player.x, player.y))
    let divID = mapID + "-div";
    selectSquare(divID);

    if (document.getElementById(divID).parentElement.classList.contains("unlocked")) {
      goBtn.disabled = false;
    }

  }, 0)

}

function selectSquare(divID) {
  for (let child of document.querySelectorAll(".square")) child.classList.remove('squareSelected')
  document.getElementById(divID).classList.add('squareSelected')
}

export function returnToLanding() {
  stop_background_music()
  mapData = [];
  enemies = [];
  collisionMap = [];
  interactionObjects = [];
  window.spawners = [];
  gameState.update = function () { };
  gameState.draw = function () { };
  gameState.state = gameState.MENU;
  goBtn.disabled = true;
  goBtn.blur();
  setTimeout(() => {
    alarm = 0;
    let mapID = "map" + window.mapID
    setMapData(mapID);
    player = new Player(PLAYER_SPAWN_LOCATIONS[window.mapID].x, PLAYER_SPAWN_LOCATIONS[window.mapID].y);
    interactionObjects.push(new Entrance(player.x, player.y))
    previewctx.drawImage(floorCanvas, 0, 0);
    previewctx.drawImage(collisionCanvas, 0, 0);
    let divID = mapID + "-div";
    selectSquare(divID);
    goBtn.blur();
    goBtn.disabled = false;
  }, 0)
  showLanding();
}
