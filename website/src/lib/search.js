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
    context.strokeStyle = "black";
    context.lineWidth = Math.min(w / 2, 3);
    context.strokeRect(x, y, w, h);
  }

  function drawBackground() {
    const c = d3.rgb(interpolate(0));
    drawImageWithFilter(context, {
      x: 0,
      y: 0,
      width: width,
      height: height,
      filter: ([x, y]) => {
        const [r, g, b, a] = color([x, y]);
        const gray = Math.sqrt((r + g + b) / 3 / 255);
        return [gray * c.r, gray * c.g, gray * c.b, a];
      },
    });
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
    const array = new Array(width).fill(0).map((_, i) => i);
    const i = d3.randomInt(0, array.length)();
    const searcher = generator(array, i);
    data = [];
    for (const i of searcher) data.push({lo: i[0], hi: i[1]});
    const step = height / data.length;
    for (let i = 0; i < data.length; i++) {
      data[i].x = data[i].lo;
      data[i].y = i * step;
      data[i].h = step;
      data[i].c = d3.rgb(interpolate(1 - (i + 1) / data.length));
      data[i].w = data[i].hi - data[i].lo;
    }
    drawBackground();
    if (animated) timer = d3.interval(loop, 100);
    else once();
  };

  _.destroy = function () {
    stop();
  };

  return _;
}
