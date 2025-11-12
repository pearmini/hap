import styles from './styles';

const labels = styles.reduce((total, cur) => [...total, ...cur.labels], []);

export default function () {
  let size = [300, 150],
    timer = null,
    canvas = null,
    imageData = null,
    style = '',
    end = () => {},
    hacker = {},
    defaultStyles = styles,
    frameCount = 0,
    defaultLabels = Array.from(new Set(labels));

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

  hacker.styles = function (_) {
    return arguments.length ? ((style = _), hacker) : styles;
  };

  hacker.labels = function (_) {
    return arguments.length ? ((defaultLabels = _), hacker) : defaultLabels;
  };

  hacker.start = function () {
    const [width, height] = size;
    const ctx = canvas.getContext('2d');
    const {setup, update, draw, frameRate = 30} = defaultStyles.find(
      (d) => d.name === style
    );

    if (timer) clearInterval(timer);
    frameCount = 0;
    const data = setup({ctx, width, height, frameCount, imageData});
    step();
    timer = setInterval(step, 1000 / frameRate);
    return hacker;

    function step() {
      const isEnd = update({data, width, height, frameCount, imageData});
      draw({ctx, width, height, data, imageData, frameCount});
      frameCount++;
      if (isEnd) {
        clearInterval(timer);
        end();
        return;
      }
    }
  };

  return hacker;
}
