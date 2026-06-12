import { H, W } from "./gamesetup.js";
import { PHSZ, Point } from "./player.js";

export function* getSlidePixelsGenerator(x0, y0, theta) {
  // Calculate the step directions based on the angle
  const dirX = Math.cos(theta);
  const dirY = Math.sin(theta);

  // Normalize step sizes to prevent diagonal skipping
  const scale = Math.max(Math.abs(dirX), Math.abs(dirY));
  const stepX = dirX / scale;
  const stepY = dirY / scale;

  let currentX = x0;
  let currentY = y0;

  let lastX = null;
  let lastY = null;

  while (true) {
    // Round to nearest integer to snap to the pixel grid
    const px = Math.round(currentX);
    const py = Math.round(currentY);

    // Only yield if we have transitioned to a new unique pixel
    if (px !== lastX || py !== lastY) {
      yield {
        alignedPt: new Point(px, py),
        precisePt: new Point(currentX, currentY),
      }
      lastX = px;
      lastY = py;
    }

    // Advance along the path
    currentX += stepX;
    currentY += stepY;
  }
}

export function moveObjBy(obj, theta, speed) {
  let gen = getSlidePixelsGenerator(obj.x, obj.y, theta);
  let ox = obj.x;
  let oy = obj.y;
  let collidedX = false;
  let collidedY = false;
  while (true) {
    const { alignedPt: pt, precisePt } = gen.next().value

    if (pt.y >= obj.y + 1) {
      let c = slideDown(obj);
      collidedY ||= c
    }
    else if (pt.y <= obj.y - 1) {
      let c = slideUp(obj);
      collidedY ||= c
    }

    if (pt.x <= obj.x - 1) {
      let c = slideLeft(obj);
      collidedX ||= c
    }
    else if (pt.x >= obj.x + 1) {
      let c = slideRight(obj);
      collidedX ||= c
    }

    let dx = precisePt.x - ox;
    let dy = precisePt.y - oy;
    let distsq = dx * dx + dy * dy;
    if (distsq >= speed * speed) {
      // done moving, add fractional unit to position if there's space.
      let fracX = precisePt.x - obj.x;
      if (fracX > 0 && fracX < 1) {
        let c = slideRight(obj, { doModify: false })
        if (c) collidedX = true;
        else obj.x = precisePt.x;
      }
      else if (fracX < 0 && fracX > -1) {
        let c = slideLeft(obj, { doModify: false })
        if (c) collidedX = true;
        else obj.x = precisePt.x;
      }

      let fracY = precisePt.y - obj.y;
      if (fracY > 0 && fracY < 1) {
        let c = slideDown(obj, { doModify: false })
        if (c) collidedY = true;
        else obj.y = precisePt.y;
      }
      else if (fracY < 0 && fracY > -1) {
        let c = slideUp(obj, { doModify: false })
        if (c) collidedY = true;
        else obj.y = precisePt.y;
      }

      break
    };
  }
  return collidedX || collidedY;
}

// slide left 1 px
export function slideLeft(obj, { doModify = true, halfWidth = PHSZ } = {}) {
  let c = Math.round(obj.x - halfWidth - 1);
  if (c <= 0) return true; //left edge
  let top = Math.round(obj.y - halfWidth);
  if (top < 0) top = 0;
  let bottom = Math.round(obj.y + halfWidth);
  if (bottom > H) bottom = H;
  for (let r = top; r < bottom; r++) {
    if (window.collisionMap[r][c]) {
      // collided
      return true;
    }
  }
  if (doModify) obj.x -= 1;
  return false;
}

// slide right 1 px
export function slideRight(obj, { doModify = true, halfWidth = PHSZ } = {}) {
  let c = Math.round(obj.x + halfWidth + 1);
  if (c >= W) return true; //right edge
  let top = Math.round(obj.y - halfWidth);
  if (top < 0) top = 0;
  let bottom = Math.round(obj.y + halfWidth);
  if (bottom > H) bottom = H;
  for (let r = top; r < bottom; r++) {
    if (window.collisionMap[r][c]) {
      // collided
      return true;
    }
  }
  if (doModify) obj.x += 1;
  return false;
}

// slide up 1 px
export function slideUp(obj, { doModify = true, halfWidth = PHSZ } = {}) {
  let r = Math.round(obj.y - halfWidth - 1);
  if (r < 0) return true; //top edge
  let left = Math.round(obj.x - halfWidth);
  if (left < 0) left = 0;
  let right = Math.round(obj.x + halfWidth);
  if (right > W) right = W;
  for (let c = left; c < right; c++) {
    if (window.collisionMap[r][c]) {
      // collided
      return true;
    }
  }
  if (doModify) obj.y -= 1;
  return false;
}

// slide down 1 px
export function slideDown(obj, { doModify = true, halfWidth = PHSZ } = {}) {
  let r = Math.round(obj.y + halfWidth + 1);
  if (r >= H) return true; //bottom edge
  let left = Math.round(obj.x - halfWidth);
  if (left < 0) left = 0;
  let right = Math.round(obj.x + halfWidth);
  if (right > W) right = W;
  for (let c = left; c < right; c++) {
    if (window.collisionMap[r][c]) {
      // collided
      return true;
    }
  }
  if (doModify) obj.y += 1;
  return false;
}


