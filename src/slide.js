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
        originalPt: new Point(currentX, currentY),
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
  let collided = false;
  while (true) {
    const { alignedPt: pt, originalPt } = gen.next().value

    if (pt.y >= obj.y + 1) {
      let c = slideDown(obj);
      collided ||= c
    }
    else if (pt.y <= obj.y - 1) {
      let c = slideUp(obj);
      collided ||= c
    }

    if (pt.x <= obj.x - 1) {
      let c = slideLeft(obj);
      collided ||= c
    }
    else if (pt.x >= obj.x + 1) {
      let c = slideRight(obj);
      collided ||= c
    }

    let dx = pt.x - ox;
    let dy = pt.y - oy;
    let distsq = dx * dx + dy * dy;
    if (distsq >= speed * speed) {
      if (!collided) {
        obj.x = originalPt.x;
        obj.y = originalPt.y;
      }
      break
    };
  }
  return collided;
}

// slide left 1 px
export function slideLeft(obj, halfWidth = PHSZ) {
  let c = Math.floor(obj.x - halfWidth - 1);
  if (c <= 0) return true; //left edge
  let top = Math.floor(obj.y - halfWidth);
  if (top < 0) top = 0;
  let bottom = Math.floor(obj.y + halfWidth);
  if (bottom > H) bottom = H;
  for (let r = top; r < bottom; r++) {
    if (window.collisionMap[r][c]) {
      // collided
      return true;
    }
  }
  obj.x -= 1;
  return false;
}

// slide right 1 px
export function slideRight(obj, halfWidth = PHSZ) {
  let c = Math.floor(obj.x + halfWidth + 1);
  if (c >= W) return true; //right edge
  let top = Math.floor(obj.y - halfWidth);
  if (top < 0) top = 0;
  let bottom = Math.floor(obj.y + halfWidth);
  if (bottom > H) bottom = H;
  for (let r = top; r < bottom; r++) {
    if (window.collisionMap[r][c]) {
      // collided
      return true;
    }
  }
  obj.x += 1;
  return false;
}

// slide up 1 px
export function slideUp(obj, halfWidth = PHSZ) {
  let r = Math.floor(obj.y - halfWidth - 1);
  if (r < 0) return true; //top edge
  let left = Math.floor(obj.x - halfWidth);
  if (left < 0) left = 0;
  let right = Math.floor(obj.x + halfWidth);
  if (right > W) right = W;
  for (let c = left; c < right; c++) {
    if (window.collisionMap[r][c]) {
      // collided
      return true;
    }
  }
  obj.y -= 1;
  return false;
}

// slide down 1 px
export function slideDown(obj, halfWidth = PHSZ) {
  let r = Math.floor(obj.y + halfWidth + 1);
  if (r >= H) return true; //bottom edge
  let left = Math.floor(obj.x - halfWidth);
  if (left < 0) left = 0;
  let right = Math.floor(obj.x + halfWidth);
  if (right > W) right = W;
  for (let c = left; c < right; c++) {
    if (window.collisionMap[r][c]) {
      // collided
      return true;
    }
  }
  obj.y += 1;
  return false;
}


