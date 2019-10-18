import { noise } from "../noise.js"

const map = (value, start, end, min, max) => {
  if (end != value) {
    const left = (value - start) / (end - value);
    return (min + left * max) / (1 + left);
  } else {
    return max;
  }
}

const perlin = function(width, height, pixelsData, ratio) {
  //开始取样
  const res = [];
  const base = 4000;
  const cnt = base * ratio | 0;
  const length = width * height;
  // 移动一下让点尽量充满屏幕
  for (let i = 0; i < cnt; i++) {

    const seedX = noise(i);
    const seedY = noise(i + 10000);
    const x = map(seedX, 0, 1, 0, width) | 0;
    const y = map(seedY, 0, 1, 0, height) | 0;
    const index = y * width + x;
    const data = {
      x: index % width,
      y: Math.floor(index / width),
      r: pixelsData[index * 4 + 0],
      g: pixelsData[index * 4 + 1],
      b: pixelsData[index * 4 + 2],
      a: pixelsData[index * 4 + 3]
    }
    res.push(data);
  }
  // console.log(min, max);
  return {
    data: res,
    sampleRate: 10 * ratio | 0
  };
}
export { perlin }