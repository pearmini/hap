import * as d3 from "d3";
import {FilterGL2} from "./filter";

export function random({
  parent,
  image,
  width,
  height,
  animated = true,
  generator,
  interpolate = d3.interpolateRainbow,
  step = 5,
}) {
  const _ = {};
  const count = (width * height) / 100;
  const filter = FilterGL2(parent, {image, width, height});
  let timer;
  let points;
  let simpler;

  function loop() {
    let p = simpler.next();
    for (let i = 0; i < step && !p.done; i++) {
      points.push(p.value);
      p = simpler.next();
    }
    if (p.done) return stop();
    draw();
  }

  function once() {
    for (const p of simpler) points.push(p);
    draw();
  }

  function draw() {
    const delaunay = d3.Delaunay.from(points);
    const voronoi = delaunay.voronoi([0, 0, width, height]);
    const P = Array.from(voronoi.cellPolygons());
    const n = P.length;
    const I = Array.from({length: n}, (_, i) => i);
    const C = I.map((i) => {
      const t = i / n;
      const {r, g, b} = d3.rgb(interpolate(t));
      return [r / 255, g / 255, b / 255, 1];
    });
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
    simpler = generator(count, [width, height]);
    points = [];
    if (animated) timer = d3.interval(loop);
    else once();
  };

  _.destroy = function () {
    stop();
  };

  return _;
}
