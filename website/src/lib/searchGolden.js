import {search} from "./search";

export function* searchGolden(array, target) {
  let lo = 0;
  let hi = array.length - 1;
  const phi = (Math.sqrt(5) - 1) / 2;
  while (lo <= hi) {
    const mid = lo + Math.floor((hi - lo) * phi);
    yield [lo, hi + 1];
    if (array[mid] === target) {
      yield [mid, mid + 1];
      return mid;
    } else if (array[mid] < target) {
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  return -1;
}

searchGolden.metadata = {
  key: "searchGolden",
  name: "Golden Search",
  description: "Golden Search",
  visualizer: search,
};
