import {
  app as createApp,
  clear,
  range,
  random,
  circle,
  vec,
  vecDist,
  mapAttrs,
} from "@charming-art/charming";

function color(imageData, index) {
  const r = imageData[index * 4];
  const g = imageData[index * 4 + 1];
  const b = imageData[index * 4 + 2];
  const a = imageData[index * 4 + 3];
  return [r, g, b, a];
}

export function randomUniform(
  { data: imageData, width, height },
  { size = 10, opacity = 0.7 }
) {
  const cols = (width / size) | 0;
  const rows = (height / size) | 0;
  const point = range(cols * rows).map(() => [
    random(width) | 0,
    random(height) | 0,
  ]);

  const app = createApp({ width, height });

  app.append(clear, { fill: "orange" });

  app
    .data(point)
    .append(circle, {
      x: (d) => d[0],
      y: (d) => d[1],
      r: (d) => vecDist(vec(width / 2, height / 2), vec(d[0], d[1])),
      fill: ([x, y]) => {
        const i = x + y * width;
        const [r, g, b, a] = color(imageData, i);
        return `rgba(${r}, ${g}, ${b}, ${a / 255})`;
      },
      fillOpacity: opacity,
    })
    .transform(mapAttrs, {
      r: { range: [size * 2, size / 2] },
    });

  app.render();

  return app;
}
