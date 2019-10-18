const swap = (array, i, j) => {
  const t = array[i];
  array[i] = array[j], array[j] = t;
}
const randomShuffle = (array, left, right) => {
  let m = right - left;
  while (m > 0) {
    const i = Math.random() * m-- | 0;
    swap(array, left + i, left + m);
  }
}

const dfs = (width, height, pixelsData, ratio) => {
  const frontier = [],
    res = [],
    cnt = width * height,
    step = 5,
    visited = new Array(cnt);

  const startIndex = Math.random() * cnt | 0;
  frontier.push(startIndex);

  while (frontier.length != 0) {
    const index = frontier.pop();
    const x = index % width,
      y = index / width | 0;

    res.push({
      x,
      y,
      r: pixelsData[index * 4 + 0],
      g: pixelsData[index * 4 + 1],
      b: pixelsData[index * 4 + 2],
      a: pixelsData[index * 4 + 3]
    })

    let next, add = 0;
    if ((x - step) >= 0 && !visited[next = (index - step)]) {
      frontier.push(next);
      visited[next] = true;
      add++;
    }

    if ((x + step) < width && !visited[next = (index + step)]) {
      frontier.push(next);
      visited[next] = true;
      add++;
    }

    if ((y - step) >= 0 && !visited[next = (index - width * step)]) {
      frontier.push(next);
      visited[next] = true;
      add++;
    }

    if ((y + step) < height && !visited[next = (index + width * step)]) {
      frontier.push(next);
      visited[next] = true;
      add++;
    }

    const len = frontier.length;
    randomShuffle(frontier, len - add, len); // [)
  }

  return {
    data: res.reverse(),
    sampleRate: 20 * ratio | 0
  };
}

export { dfs }