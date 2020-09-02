// 找到第一个大于等于的
export const bisectLeft = (a, x, options = {}) => {
  let {compare, lo, hi, step} = options;
  if (compare === undefined) compare = (a, b) => a - b;
  if (lo === undefined) lo = 0;
  if (hi === undefined) hi = a.length;
  while (lo < hi) {
    step && step(lo, hi);
    const mid = (lo + hi) >>> 1;
    if (compare(a[mid], x) < 0) lo = mid + 1;
    else hi = mid;
  }
  return lo;
};

// 找到第一个小于等于的
export const bisectRight = (a, x, options = {}) => {
  let {compare, lo, hi, step} = options;
  if (compare === undefined) compare = (a, b) => a - b;
  if (lo === undefined) lo = 0;
  if (hi === undefined) hi = a.length;
  while (lo < hi) {
    step && step(lo, hi);
    const mid = (lo + hi) >>> 1;
    if (compare(a[mid], x) > 0) hi = mid;
    else lo = mid + 1;
  }
  return hi;
};
