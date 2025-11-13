import {search} from "./search";

export function* searchBinary(array, target) {
  let lo = 0;
  let hi = array.length;
  while (lo < hi) {
    yield [lo, hi];
    const mid = (lo + hi) >>> 1;
    if (array[mid] === target) {
      yield [mid, mid + 1];
      return mid;
    } else if (array[mid] < target) {
      lo = mid + 1;
    } else {
      hi = mid;
    }
  }
  return -1;
}

searchBinary.metadata = {
  key: "searchBinary",
  name: "Binary Search",
  description: "Binary Search",
  visualizer: search,
};
