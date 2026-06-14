import { archiClient } from "./archi";

const shopMessage = document.getElementById('shopMessage');


const purchaseStaminabtn = document.getElementById("purchaseStaminabtn");
const purchaseGuardVisionbtn = document.getElementById("purchaseGuardVisionbtn");
const purchaseHealthbtn = document.getElementById("purchaseHealthbtn");
const purchaseGuardAccuracybtn = document.getElementById("purchaseGuardAccuracybtn");
const purchaseLockbtn = document.getElementById("purchaseLockbtn");

purchaseStaminabtn.onclick = purchaseStamina;
// purchaseGuardVisionbtn.onclick = purchaseGuardVision;
purchaseHealthbtn.onclick = purchaseHealth;
purchaseGuardAccuracybtn.onclick = purchaseGuardAccuracy;
purchaseLockbtn.onclick = purchaseLock;

function purchaseStamina() {
  if (window.walletAmt < 500) {
    shopMessage.innerHTML = "Not enough funds to buy more stamina!";
    return;
  }
  if (maxStamina >= 200) {
    shopMessage.innerHTML = "Max stamina reached!";
    return;
  }
  addToWallet(-500);
  maxStamina += 20;
  player.stamina = maxStamina;
  document.getElementById("wallet").innerHTML = window.walletAmt;

}


function purchaseGuardVision() {
  if (walletAmt < 500) {
    shopMessage.innerHTML = "Not enough funds to buy decreased guard vision!";
    return;
  }
  if (VISRADIUS <= 100) {
    shopMessage.innerHTML = "Minimum Guard Vision reached!";
    return;
  }
  addToWallet(-500);
  VISRADIUS -= 10;
  document.getElementById("wallet").innerHTML = window.walletAmt;

}

function purchaseGuardAccuracy() {
  if (walletAmt < 500) {
    shopMessage.innerHTML = "Not enough funds to buy decreased guard accuracy!";
    return;
  }
  if (bulletSpread > .4) {
    shopMessage.innerHTML = "Minimum Guard Accuracy reached!";
    return;
  }
  addToWallet(-500);
  bulletSpread += .05;
  document.getElementById("wallet").innerHTML = window.walletAmt;
}

function purchaseHealth() {
  if (walletAmt < 500) {
    shopMessage.innerHTML = "Not enough funds to buy more health!";
    return;
  }
  if (maxHealth >= 300) {
    shopMessage.innerHTML = "Max Health reached!";
    return;
  }
  addToWallet(-500);
  maxHealth += 20;
  player.health = maxHealth;
  document.getElementById("wallet").innerHTML = window.walletAmt;
}

function purchaseLock() {
  if (walletAmt < 1000) {
    shopMessage.innerHTML = "Not enough funds to buy that upgrade!";
    return;
  }
  if (onelesspin) {
    shopMessage.innerHTML = "You already have that one!";
    return;
  }
  addToWallet(-1000);
  onelesspin = true;
  document.getElementById("wallet").innerHTML = window.walletAmt;
}


export function addToWallet(amount) {
  window.walletAmt += amount;
  localStorage.setItem(`${archiClient.room.seedName}wallet`, window.walletAmt);
  document.getElementById("wallet").innerHTML = window.walletAmt;
}

export function loadWallet() {
  if (localStorage.getItem(`${archiClient.room.seedName}wallet`)) {
    window.walletAmt = parseInt(localStorage.getItem(`${archiClient.room.seedName}wallet`));
  }
  else {
    window.walletAmt = 0;
  }
}