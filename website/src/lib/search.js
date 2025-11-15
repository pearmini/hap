import * as d3 from "d3";
import {FilterGL2} from "./filter";

export function search({
  parent,
  image,
  width,
  height,
  animated = true,
  generator,
  interpolate = d3.interpolateRainbow,
}) {
  const _ = {};
  const filter = FilterGL2(parent, {image, width, height});
  let timer;
  let data;
  let index = 0;

  function loop() {
    if (index >= data.length) return stop();
    draw(index + 1);
    index++;
  }

  function once() {
    draw(data.length - 1);
  }

  function draw(n) {
    const I = new Array(n).fill(0).map((_, i) => i);
    const P = data.slice(0, n + 1).map((d) => [
      [d.x, d.y],
      [d.x + d.w, d.y],
      [d.x + d.w, d.y + d.h],
      [d.x, d.y + d.h],
    ]);
    const C = data.slice(0, n + 1).map((d) => d.c);
    filter.fillPolygons(I, P, C);
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
    const wi = d3.randomInt(0, W.length)();
    const searcherW = generator(W, wi);
    const H = new Array(height).fill(0).map((_, i) => i);
    const hi = d3.randomInt(0, H.length)();
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
      const {r, g, b} = d3.rgb(interpolate(t));
      data.push({
        x: x0,
        y: y0,
        h: y1 - y0,
        w: x1 - x0,
        c: [r / 255, g / 255, b / 255, 1],
      });
    }
    if (!animated) once();
    else (timer = d3.interval(loop, 100)), loop();
  };

  _.destroy = function () {
    stop();
  };

  return _;
}
