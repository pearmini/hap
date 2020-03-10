const random = function(width, height, pixelsData, ratio) {
  const res = [];
  const base = 4000;
  const cnt = (base * ratio) | 0;
  for (let i = 0; i < cnt; i++) {
    const index = parseInt(Math.random() * width * height);
    const data = {
      x: index % width,
      y: Math.floor(index / width),
      r: pixelsData[index * 4 + 0],
      g: pixelsData[index * 4 + 1],
      b: pixelsData[index * 4 + 2],
      a: pixelsData[index * 4 + 3]
    };
    res.push(data);
  }
  return {
    data: res,
    sampleRate: (10 * ratio) | 0
  };
};
export { random };
