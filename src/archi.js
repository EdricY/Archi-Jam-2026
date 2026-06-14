import { Client } from "archipelago.js";
import { addToWallet } from "./shop";

const heist_jam_base_id = 2785000

export const item_name_to_id = {
  "World 2 Key": heist_jam_base_id + 0,
  "World 3 Key": heist_jam_base_id + 1,
  "World 4 Key": heist_jam_base_id + 2,
  "World 5 Key": heist_jam_base_id + 3,
  "$200": heist_jam_base_id + 4,
}

export const location_name_to_id = {
  "Level 1 Chest 1": heist_jam_base_id + 100,
  "Level 1 Chest 2": heist_jam_base_id + 101,
  "Level 2 Chest 1": heist_jam_base_id + 102,
  "Level 2 Chest 2": heist_jam_base_id + 103,
  "Level 3 Chest 1": heist_jam_base_id + 104,
  "Level 3 Chest 2": heist_jam_base_id + 105,
  "Level 4 Chest 1": heist_jam_base_id + 106,
  "Level 4 Chest 2": heist_jam_base_id + 107,
  "Level 5 Chest 1": heist_jam_base_id + 108,
  "Level 5 Chest 2": heist_jam_base_id + 109,
  "Level 6 Chest 1": heist_jam_base_id + 110,
  "Level 6 Chest 2": heist_jam_base_id + 111,
  "Level 7 Chest 1": heist_jam_base_id + 112,
  "Level 7 Chest 2": heist_jam_base_id + 113,
  "Level 8 Chest 1": heist_jam_base_id + 114,
  "Level 8 Chest 2": heist_jam_base_id + 115,
  "Level 9 Chest 1": heist_jam_base_id + 116,
  "Level 9 Chest 2": heist_jam_base_id + 117,
  "Level 10 Chest 1": heist_jam_base_id + 118,
  "Level 10 Chest 2": heist_jam_base_id + 119,
  "Level 11 Chest 1": heist_jam_base_id + 120,
  "Level 11 Chest 2": heist_jam_base_id + 121,
  "Level 12 Chest 1": heist_jam_base_id + 122,
  "Level 12 Chest 2": heist_jam_base_id + 123,
  "Level 13 Chest 1": heist_jam_base_id + 124,
  "Level 13 Chest 2": heist_jam_base_id + 125,
  "Level 14 Chest 1": heist_jam_base_id + 126,
  "Level 14 Chest 2": heist_jam_base_id + 127,
  "Level 15 Chest 1": heist_jam_base_id + 128,
  "Level 15 Chest 2": heist_jam_base_id + 129,
}

export const archiClient = new Client();

archiClient.messages.on("message", (content) => {
  console.log(content);
});

const hasItemMemo = {}
export function hasItem(itemName) {
  if (hasItemMemo[itemName]) return true;
  let res = archiClient.items.received.some(x => x.name == itemName)
  if (res) hasItemMemo[itemName] = true;
  return res
}

export async function getItemNameAtLocation(locName) {
  let items = await archiClient.scout([location_name_to_id[locName]])
  if (items[0].item == null) {
    return null;
  }
  return items[0].item.name;
}