import {graph} from "./graph";
import * as d3 from "d3";

const max = 2000 * 2000;

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

    for (const neighbor of neighbors) {
      const [nx, ny] = neighbor;
      if (nx >= 0 && nx < width && ny >= 0 && ny < height && visited[nx + ny * width] == 0) {
        frontier.push(nx + ny * width);
        depth[nx + ny * width] = depth[node] + 1;
      }
    }

    visited[node] = 1;

    d3.shuffle(frontier);
  }
}

graphDfs.metadata = {
  key: "graphDfs",
  name: "Depth-First Search",
  description: "Depth-First Search pixel-by-pixel",
  visualizer: graph,
};
