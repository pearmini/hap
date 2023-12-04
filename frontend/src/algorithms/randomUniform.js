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

function context2d(width, height, dpr = null) {
  if (dpr == null) dpr = devicePixelRatio;
  const canvas = document.createElement("canvas");
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = width + "px";
  canvas.style.height = height + "px";
  const context = canvas.getContext("2d");
  context.scale(dpr, dpr);
  return context;
}

function imageData(image, width, height) {
  const context = context2d(width, height, 1);
  context.drawImage(image, 0, 0, width, height);
  const data = range(width * height);
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      const index = j * width + i;
      data[index] = context.getImageData(i, j, 1, 1).data;
    }
  }
  return data;
}

export function randomUniform(
  image,
  { width, height, size = 10, opacity = 0.7 }
) {
  const pixels = imageData(image, width, height);
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
        const [r, g, b, a] = pixels[i];
        return `rgba(${r}, ${g}, ${b}, ${a / 255})`;
      },
      fillOpacity: opacity,
    })
    .transform(mapAttrs, {
      r: { range: [size * 2, size / 2] },
    });

  return app.render();
}
