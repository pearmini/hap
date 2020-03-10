const distance = (a, b) => {
  const dx = a[0] - b[0],
    dy = a[1] - b[1];
  return Math.sqrt(dx * dx, dy * dy);
};

const findCloset = (set, d) => {
  let closetPoint,
    closeDistance = 1000000000;
  for (let s of set) {
    const dis = distance(s, d);
    if (dis < closeDistance) {
      closeDistance = dis;
      closetPoint = s;
    }
  }
  return closetPoint;
};

const bestCandidateSampler = (width, height, numCandidates, numSamplesMax) => {
  const samples = [[Math.random() * width, Math.random() * height]];
  while (samples.length < numSamplesMax) {
    let bestCandidate,
      bestDistance = 0;
    for (let i = 0; i < numCandidates; i++) {
      const c = [Math.random() * width, Math.random() * height],
        d = distance(findCloset(samples, c), c);
      if (d > bestDistance) {
        bestDistance = d;
        bestCandidate = c;
      }
    }
    samples.push(bestCandidate);
  }
  return samples;
};

const best = function(width, height, pixelsData, ratio) {
  const res = [];
  const base = 3000;
  const cnt = (base * ratio) | 0;
  const sample = bestCandidateSampler(width, height, 10, cnt);
  for (let s of sample) {
    const x = s[0] | 0,
      y = s[1] | 0;
    const index = y * width + x;
    const data = {
      x,
      y,
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
export { best };
