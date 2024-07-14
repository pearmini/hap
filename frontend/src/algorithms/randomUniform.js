import * as cm from "@charming-art/charming";
import { hsl as d3HSL, color as d3Color } from "d3-color";
import { scaleImageColor } from "./utils";

function filterColor(offset) {
  const scaleH = cm.scaleLinear([0, 1], [0, 360]);
  const scaleLDark = cm.scaleLinear([0, 1], [0, 0.4]);
  const scaleLBright = cm.scaleLinear([0, 1], [0.6, 1]);
  return {
    darker({ color }) {
      const { l } = d3HSL(color);
      const l1 = (l + offset) % 1;
      return `hsla(${scaleH(l1)}, 50%, ${scaleLDark(l) * 100}%, 0.2)`;
    },
    normal({ color }) {
      const { l } = d3HSL(color);
      const l1 = (l + offset) % 1;
      return `hsl(${scaleH(l1)}, 50%, ${l * 100}%)`;
    },
    brighter({ color }) {
      const { l } = d3HSL(color);
      const l1 = (l + offset) % 1;
      return `hsla(${scaleH(l1)}, 50%, ${scaleLBright(l) * 100}%, 0.1)`;
    },
  };
}

function gray(color) {
  const { r, g, b } = d3Color(color);
  const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
  return `rgb(${gray}, ${gray}, ${gray})`;
}

// @see https://openprocessing.org/sketch/520387
export function randomUniform(imageData, { width, height, resolve }) {
  const maxFrame = 200;
  const color = scaleImageColor([width, height], imageData);
  const { normal, darker, brighter } = filterColor(cm.random());
  const scaleLength = cm.scaleLinear([0, maxFrame], [40, 5]);
  const scaleWeight = cm.scaleLinear([0, maxFrame], [1, 0.1]);
  const scaleRotate = cm.scaleLinear([0, 1], [-Math.PI, Math.PI]);
  const SO = {
    x: (d) => -d.length / 2,
    x1: (d) => d.length / 2,
    strokeWidth: (d) => d.weight,
    strokeCap: "round",
  };

  function update(app) {
    const frameCount = app.prop("frameCount");

    const points = cm.range(40).map(() => ({
      x: cm.randomInt(width),
      y: cm.randomInt(height),
    }));

    const groups = app
      .data(points)
      .process(cm.derive, {
        color: (d) => gray(color(d.x, d.y)),
        length: scaleLength(frameCount),
        weight: scaleWeight(frameCount) * cm.randomInt(2, 10),
      })
      .process(cm.derive, {
        rotate: (d) => scaleRotate(d3HSL(d.color).l),
      })
      .append(cm.group, { x: (d) => d.x, y: (d) => d.y, rotate: (d) => d.rotate });

    if (frameCount % 3 === 0) {
      groups.append(cm.link, { ...SO, x: 0, y: 0, x1: 5, y1: 0, stroke: normal });
    } else {
      groups
        .call((d) => d.append(cm.link, { ...SO, y: 1, y1: 1, stroke: darker }))
        .call((d) => d.append(cm.link, { ...SO, y: 0, y1: 0, stroke: normal }))
        .call((d) => d.append(cm.link, { ...SO, y: 2, y1: 2, stroke: brighter }));
    }

    if (frameCount > maxFrame) {
      app.stop();
      resolve();
    }
  }

  return cm.app({ width, height }).on("update", update).start();
}
