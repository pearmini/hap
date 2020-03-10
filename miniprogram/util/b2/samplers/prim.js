function minHeap(compare) {
  var heap = {},
    array = [],
    size = 0;

  heap.empty = function() {
    return !size;
  };

  heap.push = function(value) {
    up((array[size] = value), size++);
    return size;
  };

  heap.pop = function() {
    if (size <= 0) return;
    var removed = array[0],
      value;
    if (--size > 0) (value = array[size]), down((array[0] = value), 0);
    return removed;
  };

  function up(value, i) {
    while (i > 0) {
      var j = ((i + 1) >> 1) - 1,
        parent = array[j];
      if (compare(value, parent) >= 0) break;
      array[i] = parent;
      array[(i = j)] = value;
    }
  }

  function down(value, i) {
    while (true) {
      var r = (i + 1) << 1,
        l = r - 1,
        j = i,
        child = array[j];
      if (l < size && compare(array[l], child) < 0) child = array[(j = l)];
      if (r < size && compare(array[r], child) < 0) child = array[(j = r)];
      if (j === i) break;
      array[i] = child;
      array[(i = j)] = value;
    }
  }

  return heap;
}

const prim = function(width, height, pixelsData, ratio) {
  const frontier = minHeap(function(a, b) {
      return a.weight - b.weight;
    }),
    res = [],
    cnt = width * height,
    step = 5,
    visited = new Array(cnt);

  const startIndex = (Math.random() * cnt) | 0;
  frontier.push({ index: startIndex, weight: Math.random() });

  while (!frontier.empty()) {
    const { index } = frontier.pop();
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
      frontier.push({ index: next, weight: Math.random() });
      visited[next] = true;
    }

    if (x + step < width && !visited[(next = index + step)]) {
      frontier.push({ index: next, weight: Math.random() });
      visited[next] = true;
    }

    if (y - step >= 0 && !visited[(next = index - width * step)]) {
      frontier.push({ index: next, weight: Math.random() });
      visited[next] = true;
    }

    if (y + step < height && !visited[(next = index + width * step)]) {
      frontier.push({ index: next, weight: Math.random() });
      visited[next] = true;
    }
  }

  return {
    data: res.reverse(),
    sampleRate: (20 * ratio) | 0
  };
};
export { prim };
