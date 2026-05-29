import { randInt } from "./gamesetup";

const SAFE_OPENING = document.getElementById("safe_opening");
const ALARM = document.getElementById("alarm_sound");
const BACKGROUND = document.getElementById("background_music");

const injury_0 = document.getElementById("injury_0");
const injury_1 = document.getElementById("injury_1");
const injury_2 = document.getElementById("injury_2");
const INJURIES = [injury_0, injury_1, injury_2];


const lock_picking_0 = document.getElementById("lock_picking_0");
const lock_picking_1 = document.getElementById("lock_picking_1");
const lock_picking_2 = document.getElementById("lock_picking_2");
const lock_picking_3 = document.getElementById("lock_picking_3");
const LOCK_PICKING = [lock_picking_0, lock_picking_1, lock_picking_2, lock_picking_3];


export function play_lock_picking_noise() {
  let song = randInt(0, 4);
  LOCK_PICKING[song].currentTime = 0;
  LOCK_PICKING[song].play();
}

export function play_injury_noise() {
  let song = randInt(0, 3);
  INJURIES[song].currentTime = 0;
  INJURIES[song].play();
}

export function play_open_noise() {
  SAFE_OPENING.currentTime = 0;
  SAFE_OPENING.play();
}

export function play_background_music() {
  BACKGROUND.loop = true;
  BACKGROUND.currentTime = 0;
  BACKGROUND.play();
}

export function stop_background_music() {
  BACKGROUND.pause();
}
