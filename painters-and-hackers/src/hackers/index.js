import styles from './style';

export default function () {
  let size = [300, 150],
    timer = null,
    canvas = null,
    imageData = null,
    style = '',
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

  hacker.end = function (_) {
    return arguments.length ? ((end = _), hacker) : end;
  };

  hacker.style = function (_) {
    return arguments.length ? ((style = _), hacker) : style;
  };

  hacker.start = function () {
    // 配置 canvas
    const [width, height] = size;
    const ctx = canvas.getContext('2d');

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
        end();
        return;
      }
      const action = actions[currentFrameIndex++];
      const data = action();
      const layout = currentLayout(data, width, height);
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
