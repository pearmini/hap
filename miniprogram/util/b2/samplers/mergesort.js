const mergeSort = (array) => {
  var arrays = [array.slice()],
    n = array.length,
    array0 = array,
    array1 = new Array(n);

  for (var m = 1; m < n; m <<= 1) {
    for (var i = 0; i < n; i += (m << 1)) {
      merge(i, Math.min(i + m, n), Math.min(i + (m << 1), n));
    }
    arrays.push(array1.slice());
    array = array0, array0 = array1, array1 = array;
  }

  function merge(left, right, end) {
    for (var i0 = left, i1 = right, j = left; j < end; ++j) {
      array1[j] = array0[i0 < right && (i1 >= end || array0[i0] <= array0[i1]) ? i0++ : i1++];
    }
  }

  return arrays;
}

const map = (value, start, end, min, max) => {
  if (end != value) {
    const left = (value - start) / (end - value);
    return (min + left * max) / (1 + left);
  } else {
    return max;
  }
}

const getRandomNumbers = cnt => {
  const range = cnt * cnt;
  const numbers = [];
  let min = range + 1,
    max = 0;
  for (let i = 0; i < cnt; i++) {
    const n = Math.random() * range | 0;
    min = min > n ? n : min;
    max = max < n ? n : max;
    numbers.push(n)
  }
  return { numbers, max, min }
}

const mergesort = function(width, height, pixelsData, ratio) {
  const cellsize = 5;
  const numberCnt = width / cellsize | 0;
  const { numbers, max, min } = getRandomNumbers(numberCnt);
  const swaps = mergeSort(numbers);
  const res = [];
  for (let y = 0; y < height - cellsize; y += cellsize) {
    for (let x = 0; x < width - cellsize; x += cellsize) {
      const i = map(x, 0, width, 0, swaps[0].length) | 0,
        j = map(y, 0, height, 0, swaps.length) | 0;
      const a = map(swaps[j][i], min, max, 0, 255);
      const index = y * width + x;
      const data = {
        x: index % width,
        y: Math.floor(index / width),
        r: pixelsData[index * 4 + 0],
        g: pixelsData[index * 4 + 1],
        b: pixelsData[index * 4 + 2],
        a,
        single: true
      }
      res.push(data);
    }
  }
  return {
    data: res.reverse(),
    sampleRate: 10 * ratio | 0
  };
}
export { mergesort }