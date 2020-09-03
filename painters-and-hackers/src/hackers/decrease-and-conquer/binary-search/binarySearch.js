// center
// [lo, hi)
export const bisectCenter = (a, x, options = {}) => {
  let {compare, lo, hi, step} = options;
  if (compare === undefined) compare = (a, b) => a - b;
  if (lo === undefined) lo = 0;
  if (hi === undefined) hi = a.length;
  while (lo < hi) {
    step && step(lo, hi);
    const mid = (lo + hi) >>> 1;
    if (a[mid] === x) return mid;
    else if (compare(a[mid], x) < 0) lo = mid + 1;
    else hi = mid;
  }
  return -1;
};

// lower bound
// [lo, hi]
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

// upper bound
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
