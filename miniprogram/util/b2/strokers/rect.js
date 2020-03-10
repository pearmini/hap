import map from "../common/map";

const rect = (ctx, data, progress) => {
  const r = map(progress, 0, 1, 10, 5);
  const alpha = map(data.a, 0, 255, 0, 1);
  ctx.beginPath();
  ctx.fillStyle = `rgba(0, 0, ${data.b}, ${alpha})`;
  ctx.rect(data.x, data.y, r * 2, r * 2);
  ctx.fill();
};

export { rect };
