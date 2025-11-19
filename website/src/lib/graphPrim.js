import {graph} from "./graph";
import * as d3 from "d3";

function minHeap(compare) {
  var heap = {},
    array = [],
    size = 0;

  heap.empty = function () {
    return !size;
  };

  heap.push = function (value) {
    up((array[size] = value), size++);
    return size;
  };

  heap.pop = function () {
    if (size <= 0) return;
    var removed = array[0],
      value;
    if (--size > 0) (value = array[size]), down((array[0] = value), 0);
    return removed;
  };

  function up(value, i) {
    while (i > 0) {
      var j = ((i + 1) >> 1) - 1,
        parent = array[j];
      if (compare(value, parent) >= 0) break;
      array[i] = parent;
      array[(i = j)] = value;
    }
  }

  function down(value, i) {
    while (true) {
      var r = (i + 1) << 1,
        l = r - 1,
        j = i,
        child = array[j];
      if (l < size && compare(array[l], child) < 0) child = array[(j = l)];
      if (r < size && compare(array[r], child) < 0) child = array[(j = r)];
      if (j === i) break;
      array[i] = child;
      array[(i = j)] = value;
    }
  }

  return heap;
}

function prim(graph, v, options = {}) {
  const {step} = options;
  const vertices = new Set();
  const edges = minHeap((a, b) => a.weight - b.weight);
  const n = graph.vertexSize();
  while (vertices.size < n) {
    const to = vertices.size ? edges.pop().to : v;
    if (!vertices.has(to)) {
      step && step(to);
      vertices.add(to);
      const e = graph.getEdgeByVertex(to);
      e.forEach((d) => edges.push(d));
    }
  }
}

export function* graphPrim(width, height) {
  const randomWeights = d3.randomUniform();
  const n = width * height;
  const visited = new Array(n).fill(0);
  const depth = new Array(n).fill(0);
  const weights = new Array(n).fill(0).map(() => randomWeights());
  const edges = minHeap((i, j) => weights[i] - weights[j]);
  const startV = d3.randomInt(0, n)();
  const vertices = new Set();

  while (vertices.size < n) {
    const to = vertices.size ? edges.pop() : startV;
    const x = Math.floor(to % width);
    const y = Math.floor(to / width);
    const neighbors = [
      [x - 1, y],
      [x + 1, y],
      [x, y - 1],
      [x, y + 1],
    ];
    if (!vertices.has(to)) {
      vertices.add(to);
      yield [x, y, depth[to]];
      for (const neighbor of neighbors) {
        const [nx, ny] = neighbor;
        if (nx >= 0 && nx < width && ny >= 0 && ny < height && visited[nx + ny * width] == 0) {
          const index = nx + ny * width;
          edges.push(index);
          depth[index] = depth[to] + 1;
        }
      }
    }
  }
}

graphPrim.metadata = {
  key: "graphPrim",
  name: "Prim's Algorithm",
  description: "Prim's Minimum Spanning Tree pixel-by-pixel",
  visualizer: (options) => graph({...options, useWeights: true}),
};
