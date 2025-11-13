import * as d3 from "d3";

function scaleImageColor(imageData, [width, height]) {
  const {data, width: imageWidth, height: imageHeight} = imageData;
  const scaleX = d3.scaleLinear([0, width], [0, imageWidth]);
  const scaleY = d3.scaleLinear([0, height], [0, imageHeight]);
  return ([x0, y0]) => {
    const x = Math.round(scaleX(x0));
    const y = Math.round(scaleY(y0));
    const i = x + y * imageWidth;
    const r = data[i * 4];
    const g = data[i * 4 + 1];
    const b = data[i * 4 + 2];
    const a = data[i * 4 + 3];
    return [r, g, b, a];
  };
}

export function random({canvas, context, imageData, animated = false, generator}) {
  const _ = {};
  const dpr = window.devicePixelRatio;
  const width = canvas.width / dpr;
  const height = canvas.height / dpr;
  const count = (width * height) / 100;
  const color = scaleImageColor(imageData, [width, height]);
  let timer;
  let points;
  let simpler;

  function loop() {
    const p = simpler.next();
    if (p.done) return stop();
    points.push(p.value);
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
      context.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
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
    if (animated) {
      timer = d3.interval(loop);
    } else {
      once();
    }
  };

  _.destroy = function () {
    stop();
  };

  return _;
}

random.metadata = {
  key: "random",
  name: "Uniform Random",
  description: "Uniformly distributed random numbers",
};
