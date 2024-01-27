import * as cm from "@charming-art/charming";
import { pack as d3Pack, hierarchy as d3Hierarchy } from "d3-hierarchy";
import { scaleImageColor } from "./utils";

const sqrt2 = Math.sqrt(2);

function randomTree(count) {
  return {
    name: "0",
    children: cm.range(count).map((d) => ({
      name: `0-${d}`,
      value: cm.random(50, 1000),
    })),
  };
}

function computeOffset(r) {
  return sqrt2 * r - r;
}

export function circlePack(imageData, { width, height, resolve }) {
  let count = 800,
    color = scaleImageColor([width, height], imageData),
    background = "black",
    pack = d3Pack()
      .size([width * sqrt2, height * sqrt2])
      .padding(3),
    data = randomTree(count),
    root = pack(d3Hierarchy(data).sum((d) => d.value)),
    nodes = root.leaves().sort((a, b) => b.r - a.r),
    step = Math.ceil(nodes.length / 100),
    index = 0,
    offset = computeOffset(width / 2);

  function setup(app) {
    app.append(cm.clear, { fill: background });
  }

  function update(app) {
    const circles = nodes.slice(index, (index += step));

    app
      .data(circles)
      .process(cm.each, (d) => {
        d.x -= offset;
        d.y -= offset;
      })
      .process(cm.filter, (d) => d.x > 0 && d.y > 0 && d.x < width && d.y < height)
      .append(cm.circle, {
        x: (d) => d.x,
        y: (d) => d.y,
        r: (d) => d.r,
        fill: (d) => color(d.x, d.y),
      });

    if (index > nodes.length) {
      app.stop();
      resolve();
    }
  }

  return cm
    .app({
      width,
      height,
    })
    .call(setup)
    .on("update", update)
    .start();
}
