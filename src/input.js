window.keys = {};
window.lastKeys = {};

window.onkeydown = e => {
  let k = e.key;
  if (k == 32) e.preventDefault();
  keys[k] = true;
}

window.onkeyup = e => {
  let k = e.key;
  keys[k] = false;
}
