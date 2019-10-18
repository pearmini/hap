const insertSort = (array) => {
  const res = [array.slice()];
  for(let i = 0; i < array.length; i++){
    let j;
    for(j = i; j >= 0; j--){
      if(array[i] > array[j]){
        break;
      }
    }
    let t = array[i];
    for(let m = i; m > j; m--){
      array[m] = array[m - 1];
    }
    array[j + 1] = t;
    res.push(array.slice());
  }
  return res;
}

const swap = (array, a, b) => {
  const t = array[a];
  array[a] = array[b], array[b] = t;
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

const insertsort = function(width, height, pixelsData, ratio) {
  const cellsize = 5;
  const numberCnt = width / cellsize | 0;
  const { numbers, max, min } = getRandomNumbers(numberCnt);
  const swaps = insertSort(numbers);
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
export { insertsort }