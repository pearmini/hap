import * as cm from "@charming-art/charming";
import { scaleImageColor } from "./utils";

export function randomNoise(imageData, { width, height, resolve }) {
  const speed = 0.4,
    scale = 800,
    count = 1000,
    maxFrame = 300,
    noise = cm.randomNoise(0, cm.TWO_PI * scale),
    scaleColor = scaleImageColor([width, height], imageData),
    scaleWeight = cm.scaleLinear([0, maxFrame], [1, 6]),
    scaleOpacity = cm.scaleLinear([0, maxFrame], [0.1, 1]),
    particles = cm.range(count).map((_, i) => ({
      type: (i / count) | 0,
      index: i % count,
      location: cm.vec(cm.random(width), cm.random(height)),
    }));

  function setup(app) {
    app.append(cm.clear, { fill: "black" });
  }

  function update(app) {
    const frameCount = app.prop("frameCount");
    const r = scaleWeight(frameCount);
    const fillOpacity = scaleOpacity(frameCount);

    app
      .data(particles)
      .process(cm.each, (d) => {
        const angle = noise(d.location.x / scale, d.location.y / scale);
        d.location.add(cm.vecFromAngle(angle).mult(speed).clamp(0.1, Infinity));
      })
      .process(cm.each, (d) => {
        if (d.location.inX(0, width) && d.location.inY(0, height)) return;
        d.location = cm.vec(cm.random(50, width), cm.random(50, height));
      })
      .append(cm.circle, {
        x: (d) => d.location.x,
        y: (d) => d.location.y,
        r,
        fillOpacity,
        fill: (d) => scaleColor(d.location.x, d.location.y),
      });

    if (frameCount > maxFrame) {
      app.stop();
      resolve();
    }
  }

  return cm.app({ width, height }).on("beforeAll", setup).on("update", update).start();
}
