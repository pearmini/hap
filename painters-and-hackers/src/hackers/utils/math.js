function random(start, end) {
  return start + Math.random() * Math.max(end - start, 0);
}

function range(lo, hi) {
  if (arguments.length === 0) {
    hi = lo;
    lo = 0;
  }
  const a = [];
  for (let i = lo; i < hi; i++) {
    a.push(i);
  }
  return a;
}
export {random, range};
