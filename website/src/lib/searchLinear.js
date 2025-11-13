import {search} from "./search";

export function* searchLinear(array, target) {
  const step = 10;
  const n = array.length;
  for (let i = 0; i < n; i += step) {
    yield [i, n];
    if (Math.abs(array[i] - target) < step) {
      return i;
    }
  }
  return -1;
}

searchLinear.metadata = {
  key: "searchLinear",
  name: "Linear Search",
  description: "Linear Search",
  visualizer: search,
};
