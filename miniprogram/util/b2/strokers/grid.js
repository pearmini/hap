const ratio = 0.618;
const RED = 1,
  BLUE = 2,
  YELLOW = 3,
  GRAY = 4,
  WHITE = 5;

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
  if (toLeft(p1, p2, point) && toLeft(p2, p3, point) && toLeft(p3, p4, point) && toLeft(p4, p1, point)) {
    return true;
  }
  return false;
}

const getAreas = (width, height) => {
  const redHeight = width * ratio,
    leftWidth = width / (1 + ratio),
    leftHeight1 = (height - redHeight) / 6,
    leftHeight2 = (height - redHeight) / 2,
    leftHeight3 = (height - redHeight) / 3,
    rightWidth = width - leftWidth,
    rightHeight1 = (height - redHeight) * 2 / 5,
    rightHeight2 = (height - redHeight) * 3 / 5
  const border = 10;
  return [{
      p1: { x: 0, y: 0 },
      p2: { x: width, y: 0 },
      p3: { x: width, y: redHeight },
      p4: { x: 0, y: redHeight },
      type: RED
    },
    {
      p1: { x: 0, y: redHeight },
      p2: { x: leftWidth, y: redHeight },
      p3: { x: leftWidth, y: redHeight + leftHeight1 },
      p4: { x: 0, y: redHeight + leftHeight1 },
      type: WHITE
    },
    {
      p1: { x: 0, y: redHeight + leftHeight1 },
      p2: { x: leftWidth, y: redHeight + leftHeight1 },
      p3: { x: leftHeight1, y: redHeight + leftHeight1 + leftHeight2 },
      p4: { x: 0, y: redHeight + leftHeight1 + leftHeight2 },
      type: GRAY
    },
    {
      p1: { x: 0, y: redHeight + leftHeight1 + leftHeight2 },
      p2: { x: leftWidth, y: redHeight + leftHeight1 + leftHeight2 },
      p3: { x: leftWidth, y: height },
      p4: { x: 0, y: height },
      type: BLUE
    },
    {
      p1: { x: leftWidth, y: redHeight },
      p2: { x: width, y: redHeight },
      p3: { x: width, y: redHeight + rightHeight1 },
      p4: { x: leftWidth, y: redHeight + rightHeight1 },
      type: YELLOW
    },
    {
      p1: { x: leftWidth, y: redHeight + rightHeight1 },
      p2: { x: width, y: redHeight + rightHeight1 },
      p3: { x: width, y: height },
      p4: { x: leftWidth, y: height },
      type: WHITE
    }
  ]
}
const scale = (color,s) => {
  return Math.min(255, color * 1.5)
}

const bright = color => {
  return color * 2 % 255;
}
const grid = (ctx, data, progress, global) => {
  if (global.color.first) {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, global.color.width, global.color.height);
    global.color.first = false;
  }
  const areas = getAreas(global.color.width, global.color.height);
  const point = { x: data.x, y: data.y };
  const alpha = map(data.a, 0, 255, 0, 1);
  for (let a of areas) {
    if (isIn(point, a)) {
      if (a.type === RED) {
        ctx.fillStyle = `rgba(${scale(data.r, 2)}, ${0},${0}, ${alpha})`;
      } else if (a.type === BLUE) {
        ctx.fillStyle = `rgba(${0}, ${0},${scale(data.b, 2)}, ${alpha})`;
      } else if (a.type === YELLOW) {
        ctx.fillStyle = `rgba(${scale(data.r, 2)}, ${scale(data.g, 2)}, ${0}, ${alpha})`;
      } else if (a.type === GRAY) {
        const b = (data.r * 0.299 + data.g * 0.587 + data.b * 0.114) | 0;
        ctx.fillStyle = `rgba(${b}, ${b}, ${b}, ${alpha})`;
      }else if(a.type === WHITE){
        const b = (data.r * 0.299 + data.g * 0.587 + data.b * 0.114) | 0;
        const white = map(b, 0, 255, 200, 255);
        // ctx.fillStyle = `rgba(${scale(data.r,4)}, ${scale(data.g, 4)},${scale(data.b, 4)}, ${alpha})`;
        ctx.fillStyle = `rgba(${white}, ${white},${white}, ${alpha})`;
      }
      break;
    } else {
      ctx.fillStyle = 'black';
    }
  }
  const r = map(progress, 0, 1, 10, 5);
  ctx.beginPath();
  ctx.arc(data.x, data.y, r, 0, Math.PI * 2);
  ctx.fill();

}

export { grid }