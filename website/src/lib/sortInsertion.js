import {sort} from "./sort";

export function* sortInsertion(array) {
  const n = array.length;
  for (let i = 1; i < n; i++) {
    const current = array[i];
    let j = i - 1;
    while (j >= 0 && array[j] > current) {
      array[j + 1] = array[j];
      j--;
    }
    array[j + 1] = current;
    yield array.slice();
  }
  yield array.slice();
  return array;
}

sortInsertion.metadata = {
  key: "sortInsertion",
  name: "Insertion Sort",
  description: "Insertion Sort",
  visualizer: sort,
};
