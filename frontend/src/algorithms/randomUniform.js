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
  hsl,
  derive,
} from "@charming-art/charming";
import { hsl as d3HSL } from "d3-color";

function filterColor(offset) {
  const scale = scaleLinear([0, 1], [0, 360]);
  return (color) => {
    const { s, l } = d3HSL(color);
    const s1 = (s + offset) % 1;
    return hsl(scale(s1), 50, l * 100);
  };
}

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

export function randomUniform(imageData, { background, width, height, size = 8, opacity = 0.6 }) {
  const color = createColor(imageData, width, height);
  const cols = (width / size) | 0;
  const rows = (height / size) | 0;
  const point = range(cols * rows).map(() => [random(width) | 0, random(height) | 0]);
  const filter = filterColor(random());

  const app = createApp({ width, height });

  app.append(clear, { fill: filter(background) });

  app
    .data(point)
    .process(derive, {
      color: ([x, y]) => {
        const [r, g, b, a] = color(x, y);
        return `rgba(${r}, ${g}, ${b}, ${a / 255})`;
      },
    })
    .append(circle, {
      x: (d) => d[0],
      y: (d) => d[1],
      r: (d) => vecDist(vec(width / 2, height / 2), vec(d[0], d[1])),
      fill: (d) => d.color,
      stroke: (d) => d.color,
      fillOpacity: opacity,
    })
    .transform(mapAttrs, {
      r: { range: [size * 2, size / 2] },
    });

  return app.render();
}
