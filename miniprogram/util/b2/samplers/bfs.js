const popRandom = array => {
  const n = array.length,
    i = (Math.random() * n) | 0, // Math.foor
    t = array[i];
  (array[i] = array[n - 1]), (array[n - 1] = t);
  return array.pop();
};

const bfs = function(width, height, pixelsData, ratio) {
  const frontier = [],
    res = [],
    cnt = width * height,
    step = 5,
    visited = new Array(cnt);

  const startIndex = (Math.random() * cnt) | 0;
  frontier.push(startIndex);

  while (frontier.length != 0) {
    const index = popRandom(frontier);
    const x = index % width,
      y = (index / width) | 0;

    res.push({
      x,
      y,
      r: pixelsData[index * 4 + 0],
      g: pixelsData[index * 4 + 1],
      b: pixelsData[index * 4 + 2],
      a: pixelsData[index * 4 + 3]
    });

    let next;
    if (x - step >= 0 && !visited[(next = index - step)]) {
      frontier.push(next);
      visited[next] = true;
    }

    if (x + step < width && !visited[(next = index + step)]) {
      frontier.push(next);
      visited[next] = true;
    }

    if (y - step >= 0 && !visited[(next = index - width * step)]) {
      frontier.push(next);
      visited[next] = true;
    }

    if (y + step < height && !visited[(next = index + width * step)]) {
      frontier.push(next);
      visited[next] = true;
    }
  }

  return {
    data: res.reverse(),
    sampleRate: (20 * ratio) | 0
  };
};
export { bfs };
