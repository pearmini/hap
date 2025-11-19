import {sort} from "./sort";

export function* sortQuick(array, left = 0, right = array.length - 1) {
  if (left >= right) return;

  let pivot = array[right]; // Pick the rightmost element as pivot.
  let i = left;
  for (let j = left; j < right; j++) {
    if (array[j] < pivot) {
      [array[i], array[j]] = [array[j], array[i]];
      i++;
    }
  }
  [array[i], array[right]] = [array[right], array[i]];
  yield array.slice();

  yield* sortQuick(array, left, i - 1);
  yield* sortQuick(array, i + 1, right);
}

sortQuick.metadata = {
  key: "sortQuick",
  name: "Quick Sort",
  description: "Quick Sort",
  visualizer: sort,
};
