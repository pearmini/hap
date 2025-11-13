import * as d3 from "d3";
import {scaleImageColor} from "./helper";

function drawImageWithFilter(context, {x, y, width, height, filter}) {
  const dpr = window.devicePixelRatio;
  x *= dpr;
  y *= dpr;
  width *= dpr;
  height *= dpr;
  const imageData = context.createImageData(width, height);
  for (let j = 0; j < height; j++) {
    for (let i = 0; i < width; i++) {
      const [r, g, b, a] = filter([(i + x) / 2, (j + y) / 2]);
      const index = (j * width + i) * 4;
      imageData.data[index] = r;
      imageData.data[index + 1] = g;
      imageData.data[index + 2] = b;
      imageData.data[index + 3] = a;
    }
  }
  context.putImageData(imageData, x, y);
}

export function search({canvas, context, imageData, interpolate = d3.interpolateRainbow, animated = true, generator}) {
  const _ = {};
  const dpr = window.devicePixelRatio;
  const width = ~~(canvas.width / dpr);
  const height = ~~(canvas.height / dpr);
  const color = scaleImageColor(imageData, [width, height]);
  let timer;
  let data;
  let index = 0;
  let wi;
  let hi;

  function loop() {
    if (index >= data.length) return stop();
    const d = data[index];
    draw(d);
    index++;
  }

  function once() {
    for (const d of data) draw(d);
  }

  function draw(data) {
    const {x, y, h, c, w} = data;
    drawImageWithFilter(context, {
      x,
      y,
      width: w,
      height: h,
      filter: ([x, y]) => {
        const [r, g, b, a] = color([x, y]);
        const gray = Math.sqrt((r + g + b) / 3 / 255);
        return [gray * c.r, gray * c.g, gray * c.b, a];
      },
    });
    context.strokeStyle = "white";
    context.lineWidth = 0.5;
    context.strokeRect(x, y, w, h);
  }

  function stop() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  _.start = function () {
    stop();
    index = 0;
    const W = new Array(width).fill(0).map((_, i) => i);
    wi = d3.randomInt(0, W.length)();
    const searcherW = generator(W, wi);
    const H = new Array(height).fill(0).map((_, i) => i);
    hi = d3.randomInt(0, H.length)();
    const searcherH = generator(H, hi);
    const dataW = Array.from(searcherW);
    const dataH = Array.from(searcherH);
    data = [];
    const nw = dataW.length;
    const nh = dataH.length;
    const n = nw + nh;
    let x0 = 0;
    let y0 = 0;
    let x1 = width;
    let y1 = height;
    for (let i = 0; i < n; i++) {
      const m = i >>> 1;
      if (i % 2) [y0, y1] = dataH[Math.min(m, nh - 1)];
      else [x0, x1] = dataW[Math.min(m, nw - 1)];
      const t = 1 - i / (n - 1);
      data.push({
        x: x0,
        y: y0,
        h: y1 - y0,
        w: x1 - x0,
        c: d3.rgb(interpolate(t)),
      });
    }
    if (animated) timer = d3.interval(loop, 100);
    else once();
  };

  _.destroy = function () {
    stop();
  };

  return _;
}
