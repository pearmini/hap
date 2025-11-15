import {sort} from "./sort";

export function* sortBubble(array) {
  const n = array.length;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
      }
    }
    yield array.slice();
  }
  yield array.slice();
  return array;
}

sortBubble.metadata = {
  key: "sortBubble",
  name: "Bubble Sort",
  description: "Bubble Sort",
  visualizer: sort,
};
