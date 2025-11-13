function mergeSort(a, options = {}) {
  let {compare, step} = options;
  if (compare === undefined) compare = (x, y) => x - y;
  let n = a.length,
    b0 = [...a],
    b1 = new Array(n);
  step && step([...b0]);

  for (let m = 1; m < n; m <<= 1) {
    for (let i = 0; i < n; i += m << 1) {
      merge(i, Math.min(n, i + m), Math.min(n, i + (m << 1)));
    }
    step && step([...b0]);
    [b0, b1] = [b1, b0];
  }

  function merge(left, right, end) {
    for (let i0 = left, i1 = right, j = left; j < end; j++) {
      b1[j] = b0[i0 < right && (b0[i0] <= b0[i1] || i1 >= end) ? i0++ : i1++];
    }
  }

  step && step([...b0]);
  
  return b0;
}

export default mergeSort;
