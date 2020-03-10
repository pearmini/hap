import map from "../common/map";
import hslToRgb from "../common/hslToRgb";

const color = (ctx, data, progress, global) => {
  if (global.color.first) {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, global.color.width, global.color.height);
    global.color.first = false;
  }

  const type = Math.random() * 5,
    shift = (global.color.seed * 255) | 0,
    len = map(progress, 0, 1, 40, 5),
    lineWidth =
      (map(progress, 0, 1, 1, 0.1) * map(Math.random(), 0, 1, 2, 8)) | 0;

  // 设置颜色
  let b = (data.r * 0.299 + data.g * 0.587 + data.b * 0.114) | 0;
  let hue = (b + shift) % 255;
  let angle = map(b, 0, 255, -Math.PI, Math.PI);
  hue = map(hue, 0, 255, 0, 1);
  b = map(b, 0, 255, 0, 1);
  const rgb = hslToRgb(hue, b, 0.5);

  ctx.save();
  ctx.beginPath();
  ctx.translate(data.x, data.y);
  ctx.rotate(angle);
  const alpha = map(data.a, 0, 255, 0, 1);
  if (type < 4) {
    // 绘制一条线
    ctx.lineCap = "round";
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`;
    ctx.moveTo(-len, 0);
    ctx.lineTo(len, 0);
    ctx.stroke();
  } else {
    // 绘制点
    const r = map(progress, 0, 1, 10, 5);
    ctx.fillStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`;
    ctx.strokeStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`;
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
};

export { color };
