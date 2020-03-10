import map from "../common/map";

const arc = (ctx, data, progress, global) => {
  // 第一次绘制，首先把背景设置成黑色
  if (global.arc.first) {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, global.arc.width, global.arc.height);
    global.arc.first = false;
  }

  // 筛选一些点
  const valid1 = (data.x / 5) | 0,
    valid2 = (data.y / 5) | 0;
  if (valid1 % 2 != 0 || valid2 % 2 != 0) {
    return;
  }
  let r = 10,
    cnt = 5,
    type = (Math.random() * 4) | 0,
    rotation = [0, Math.PI / 2, -Math.PI, Math.PI],
    angle = rotation[type];
  ctx.save();
  ctx.translate(data.x + r / 2, data.y + r / 2);
  ctx.rotate(angle);
  ctx.translate(-r / 2, -r / 2);
  const alpha = map(data.a, 0, 255, 0, 1);

  // 画一些曲线
  ctx.strokeStyle = `rgba(${data.r}, ${data.g}, ${data.b}, ${alpha})`;
  for (let i = 0; i < cnt; i++) {
    const w = map(i, 0, cnt, 0, r);
    ctx.beginPath();
    ctx.arc(0, 0, w, 0, Math.PI / 2);
    ctx.stroke();
  }

  ctx.restore();
};

export { arc };
