import * as d3 from "d3";
import {scaleImageColor} from "./helper";

export function random({canvas, context, imageData, animated = true, generator, step = 5}) {
  const _ = {};
  const dpr = window.devicePixelRatio;
  const width = ~~(canvas.width / dpr);
  const height = ~~(canvas.height / dpr);
  const count = (width * height) / 100;
  const color = scaleImageColor(imageData, [width, height]);
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
    for (const p of simpler) {
      points.push(p);
    }
    draw();
  }

  function draw() {
    const delaunay = d3.Delaunay.from(points);
    const voronoi = delaunay.voronoi([0, 0, width, height]);
    context.fillRect(0, 0, width, height);
    for (let i = 0; i < points.length; i++) {
      const [x, y] = points[i];
      const [r, g, b, a] = color([x, y]);
      context.fillStyle = `rgba(${r}, ${g}, ${b}, ${a / 255})`;
      context.strokeStyle = `white`;
      context.lineWidth = 0.5;
      context.beginPath();
      voronoi.renderCell(i, context);
      context.stroke();
      context.fill();
    }
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
