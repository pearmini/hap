import {sort} from "./sort";

export function* sortSelection(array) {
  const n = array.length;
  for (let i = 0; i < n; i++) {
    let minIndex = i;
    for (let j = i + 1; j < n; j++) {
      if (array[j] < array[minIndex]) {
        minIndex = j;
      }
    }
    [array[i], array[minIndex]] = [array[minIndex], array[i]];
    yield array.slice();
  }
  yield array.slice();
  return array;
}

sortSelection.metadata = {
  key: "sortSelection",
  name: "Selection Sort",
  description: "Selection Sort",
  visualizer: sort,
};
