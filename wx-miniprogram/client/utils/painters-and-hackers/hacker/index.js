import styles from './style';

export default function () {
  let size = [300, 150],
    frameRate = 30,
    timer = null,
    canvas = null,
    imageData = null,
    style = '',
    stroke = null,
    frames = null,
    layout = null,
    end = () => {},
    hacker = {},
    defaultStyles = styles;

  hacker.canvas = function (_) {
    return arguments.length ? ((canvas = _), hacker) : canvas;
  };

  hacker.size = function (_) {
    return arguments.length ? ((size = _), hacker) : size;
  };

  hacker.imageData = function (_) {
    return arguments.length ? ((imageData = _), hacker) : imageData;
  };

  hacker.stroke = function (_) {
    return arguments.length ? ((stroke = _), hacker) : stroke;
  };

  hacker.frames = function (_) {
    return arguments.length ? ((frames = _), hacker) : frames;
  };

  hacker.layout = function (_) {
    return arguments.length ? ((layout = _), hacker) : layout;
  };

  hacker.end = function (_) {
    return arguments.length ? ((end = _), hacker) : end;
  };

  hacker.frameRate = function (_) {
    return arguments.length ? ((frameRate = _), hacker) : frameRate;
  };

  hacker.style = function (_) {
    return arguments.length ? ((style = _), hacker) : style;
  };

  hacker.start = function () {
    // 配置 canvas
    const [width, height] = size;
    canvas.width = width * 2;
    canvas.height = height * 2;
    const ctx = canvas.getContext('2d');
    ctx.save();
    ctx.scale(2, 2);

    // 获得可视化需要的参数
    const {
      frames: currentFrames,
      stroke: currentStroke,
      frameRate: currentFrameRate,
      layout: currentLayout,
    } = defaultStyles.find((d) => d.namspace === style);

    // 运行的主函数
    const actions = currentFrames(imageData, width, height);
    let currentFrameIndex = 0;
    if (timer) clearInterval(timer);
    setInterval(step, 1000 / currentFrameRate);
    step();

    return hacker;

    function step() {
      if (currentFrameIndex >= actions.length) {
        clearInterval(timer);
        ctx.restore();
        end();
        return;
      }
      const action = actions[currentFrameIndex++];
      const data = action();
      const layout = currentLayout(data, width, height, imageData);
      Object.keys(layout).forEach((key) => {
        const stroke = currentStroke[key];
        const data = layout[key];
        if (!stroke) return;
        data.forEach((d) => stroke(ctx, d));
      });
    }
  };

  return hacker;
}
