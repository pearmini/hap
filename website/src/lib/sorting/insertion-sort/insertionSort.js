function insertionSort(a, options = {}) {
  let {compare, step} = options;
  if (compare === undefined) compare = (x, y) => x - y;
  const b = [...a];
  step && step([...b]);
  for (let i = 1; i < b.length; i++) {
    let j = i - 1;
    const current = b[i];
    while (j >= 0 && compare(current, b[j]) < 0) {
      b[j + 1] = b[j];
      j--;
    }
    b[j + 1] = current;
    step && step([...b]);
  }
  return b;
}

export default insertionSort;
