import map from "../common/map";
const point = (ctx, data, progress) => {
  const r = map(progress, 0, 1, 10, 5);
  const single = data.single;
  const alpha = map(data.a, 0, 255, 0, 1);
  if (single) {
    //大圆
    ctx.beginPath();
    ctx.fillStyle = `rgba(${data.r}, ${data.g},${data.b},${alpha})`;
    ctx.arc(data.x, data.y, r, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.beginPath();
    ctx.fillStyle = `rgba(${data.r}, ${data.g},${data.b},${0.6})`;
    ctx.arc(data.x, data.y, r, 0, Math.PI * 2);
    ctx.fill();
    //小圆
    ctx.beginPath();
    ctx.fillStyle = `rgba(${data.r},${data.g},${data.b},${0.9})`;
    ctx.arc(data.x, data.y, r * 0.6, 0, Math.PI * 2);
    ctx.fill();
  }
};

export { point };
