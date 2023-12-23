import {
  app as createApp,
  clear,
  range,
  random,
  circle,
  vec,
  vecDist,
  mapAttrs,
  scaleLinear,
} from "@charming-art/charming";

function createColor(imageData, width, height) {
  const { data, width: imageWidth, height: imageHeight } = imageData;
  const scaleX = scaleLinear([0, width], [0, imageWidth]);
  const scaleY = scaleLinear([0, height], [0, imageHeight]);
  return (x0, y0) => {
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

export function randomUniform(imageData, { width, height, size = 10, opacity = 0.7 }) {
  const color = createColor(imageData, width, height);
  const cols = (width / size) | 0;
  const rows = (height / size) | 0;
  const point = range(cols * rows).map(() => [random(width) | 0, random(height) | 0]);

  const app = createApp({ width, height });

  app.append(clear, { fill: "orange" });

  app
    .data(point)
    .append(circle, {
      x: (d) => d[0],
      y: (d) => d[1],
      r: (d) => vecDist(vec(width / 2, height / 2), vec(d[0], d[1])),
      fill: ([x, y]) => {
        const [r, g, b, a] = color(x, y);
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
