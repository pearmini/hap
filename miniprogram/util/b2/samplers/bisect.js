const IN = 1,
  LEFT = 2,
  RIGHT = 3,
  TOP = 4,
  BOTTOM = 5,
  S = 6,
  F = 7;
const map = (value, start, end, min, max) => {
  if (end != value) {
    const left = (value - start) / (end - value);
    return (min + left * max) / (1 + left);
  } else {
    return max;
  }
}
const cross = (v1, v2) => {
  return v1[0] * v2[1] - v1[1] * v2[0];
}

const toLeft = (p1, p2, p) => {
  const v1 = [p2.x - p1.x, p2.y - p1.y],
    v2 = [p.x - p1.x, p.y - p1.y];
  return cross(v1, v2) >= 0 ? true : false;
}

const isIn = (point, area) => {
  const { p1, p2, p3, p4 } = area;
  if (!toLeft(p1, p2, point)) {
    return TOP;
  }
  if (!toLeft(p2, p3, point)) {
    return RIGHT;
  }
  if (!toLeft(p3, p4, point)) {
    return BOTTOM;
  }
  if (!toLeft(p4, p1, point)) {
    return LEFT;
  }

  return IN
}

const move = (area, type, w, h) => {
  const { p1, p2, p3, p4 } = area;
  const plist = [p1, p2, p3, p4];
  for (let p of plist) {
    if (type === LEFT) {
      p.x -= w;
    } else if (type === RIGHT) {
      p.x += w;
    } else if (type === BOTTOM) {
      p.y += h;
    } else {
      p.y -= h;
    }
  }
}

const split = (area, w, h) => {
  const { p1, p2, p3, p4 } = area;
  if (w > h) {
    // split the width
    const mid = (p1.x + p2.x) / 2 | 0;
    area.p2.x = mid, area.p3.x = mid;
  } else {
    // split the height
    const mid = (p1.y + p4.y) / 2 | 0;
    area.p3.y = mid, area.p4.y = mid;
  }
}

// 当只有一个格子的时候执行成功
const done = area => {
  const { p1, p2, p3, p4 } = area;
  const w = p2.x - p1.x,
    h = p4.y - p1.y,
    thres = 100;
  return w * h < thres ? true : false;
}

const fill = (area, res, width, data, flag) => {
  const { p1, p2, p3, p4 } = area;
  const w = p2.x - p1.x,
    h = p4.y - p1.y;
  const cnt = w * h / 100;
  const colorScale = map(flag, 0, 15, 1, 3);
  for (let i = 0; i < cnt; i++) {
    const x = (Math.random() * w + p1.x) | 0,
      y = (Math.random() * h + p1.y) | 0,
      index = x + y * width;
    const r = data[index * 4 + 0],
      g = data[index * 4 + 1],
      b = data[index * 4 + 2],
      a = data[index * 4 + 3];
    res.push({
      x,
      y,
      r: Math.min(r * colorScale, 255) | 0,
      g: Math.min(g * colorScale, 255) | 0,
      b: Math.min(b * colorScale, 255) | 0,
      a: a
    })
  }
}


const bisect = function(width, height, pixelsData, ratio) {
  const res = [],
    findPoint = { x: Math.random() * width | 0, y: Math.random() * height | 0 };

  let area = {
      p1: { x: 0, y: 0 },
      p2: { x: width, y: 0 },
      p3: { x: width, y: height },
      p4: { x: 0, y: height }
    },
    flag = 0;

  while (true) {
    flag++;
    const type = isIn(findPoint, area),
      { p1, p2, p3, p4 } = area,
      w = p2.x - p1.x,
      h = p4.y - p1.y;

    if (type === IN) {
      if (done(area)) break;
      fill(area, res, width, pixelsData, flag);
      split(area, w, h);
    } else {
      move(area, type, w, h);
    }
  }
  return {
    data: res.reverse(),
    sampleRate: 20 * ratio | 0
  };
}
export { bisect }