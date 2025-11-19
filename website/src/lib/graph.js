import * as d3 from "d3";
import {FilterGL2} from "./filter";

export function graph({
  parent,
  image,
  width,
  height,
  animated = true,
  generator,
  interpolate = d3.interpolateRainbow,
  step = 1000,
}) {
  const _ = {};
  const filter = (_.filter = FilterGL2(parent, {image, width, height}));
  let timer;
  let graph;

  function loop() {
    let p;
    const points = [];
    for (let i = 0; i < step; i++) {
      p = graph.next();
      if (!p.done) points.push(p.value);
    }
    draw(points);
    if (p.done) return stop();
  }

  function once() {
    const points = Array.from(graph);
    draw(points);
  }

  function draw(points) {
    const I = points.map((_, i) => i);
    const X = points.map((p) => p[0]);
    const Y = points.map((p) => p[1]);
    const C = points.map((p) => {
      let t = p[2] / 500;
      t = t - Math.floor(t);
      let {r, g, b} = d3.rgb(interpolate(t));
      return [r / 255, g / 255, b / 255, 1];
    });
    filter.fillPoints(I, X, Y, C);
  }

  function stop() {
    if (timer) {
      timer.stop();
      timer = null;
    }
  }

  _.start = function () {
    stop();
    filter.fillRect(0, 0, width, height, [0, 0, 0, -1]);
    graph = generator(width, height);
    if (animated) timer = d3.interval(loop, 0);
    else once();
  };

  _.destroy = function () {
    stop();
  };

  return _;
}
