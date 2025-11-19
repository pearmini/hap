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
  step = 300,
}) {
  const _ = {};
  const filter = (_.filter = FilterGL2(parent, {image, width, height}));
  const randomMaxDepth = d3.randomInt(500, 1200);
  let timer;
  let graph;
  let maxDepth;

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
      // Uncomment to add some noise, which is very cool!
      // let t = p[2] / randomMaxDepth();
      let t = p[2] / maxDepth;
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
    maxDepth = randomMaxDepth();
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
