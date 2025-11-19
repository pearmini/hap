import {graph} from "./graph";
import * as d3 from "d3";

const max = 2000 * 2000;

function swap(array, i, j) {
  const tmp = array[i];
  array[i] = array[j];
  array[j] = tmp;
}

function shuffle(array, left, right) {
  let m = right - left;
  while (m > 0) {
    const i = Math.floor(Math.random() * m--);
    swap(array, left + i, left + m);
  }
}

export function* graphDfs(width, height) {
  const visited = new Array(width * height).fill(0);
  const depth = new Array(width * height).fill(0);
  const frontier = [];
  const startV = d3.randomInt(0, width * height)();

  frontier.push(startV);
  visited[startV] = 0;
  depth[startV] = 0;

  let k = 0;

  while (++k < max && frontier.length > 0) {
    const node = frontier.pop();
    if (visited[node] == 1) continue;

    const x = Math.floor(node % width);
    const y = Math.floor(node / width);

    yield [x, y, depth[node]];

    const neighbors = [
      [x - 1, y],
      [x + 1, y],
      [x, y - 1],
      [x, y + 1],
    ];

    let m = 0;
    for (const neighbor of neighbors) {
      const [nx, ny] = neighbor;
      if (nx >= 0 && nx < width && ny >= 0 && ny < height && visited[nx + ny * width] == 0) {
        frontier.push(nx + ny * width);
        depth[nx + ny * width] = depth[node] + 1;
        m++;
      }
    }

    visited[node] = 1;

    shuffle(frontier, frontier.length - m, frontier.length);
  }
}

graphDfs.metadata = {
  key: "graphDfs",
  name: "Depth-First Traversal",
  description: "Depth-First Traversal pixel-by-pixel",
  visualizer: graph,
};
