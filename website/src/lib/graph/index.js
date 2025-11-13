import Graph from "../data-structures/graph/Graph";
import {random, getImageData, grid, map} from "../utils/index";
import * as d3 from "d3";

export const getTestGraph = () => {
  const graph = new Graph();
  graph.addEdge("a", "b", 4);
  graph.addEdge("b", "a", 4);

  graph.addEdge("b", "h", 11);
  graph.addEdge("h", "b", 11);

  graph.addEdge("a", "h", 8);
  graph.addEdge("h", "a", 8);

  graph.addEdge("b", "c", 8);
  graph.addEdge("c", "b", 8);

  graph.addEdge("h", "i", 7);
  graph.addEdge("i", "h", 7);

  graph.addEdge("i", "c", 2);
  graph.addEdge("c", "i", 2);

  graph.addEdge("c", "d", 7);
  graph.addEdge("d", "c", 7);

  graph.addEdge("c", "f", 4);
  graph.addEdge("f", "c", 4);

  graph.addEdge("i", "g", 6);
  graph.addEdge("g", "i", 6);

  graph.addEdge("h", "g", 1);
  graph.addEdge("g", "h", 1);

  graph.addEdge("g", "f", 2);
  graph.addEdge("f", "g", 2);

  graph.addEdge("f", "d", 14);
  graph.addEdge("d", "f", 14);

  graph.addEdge("d", "e", 9);
  graph.addEdge("e", "d", 9);

  graph.addEdge("e", "f", 10);
  graph.addEdge("f", "e", 10);

  return graph;
};

export const getVisGraph = (row, col) => {
  const UNDISCOVERED = 0,
    DISCOVERED = 1;

  const graph = new Graph(),
    status = d3.range(row * col).map(() => UNDISCOVERED),
    queue = [[0, 0]];

  const index = (x, y) => x + y * col,
    isValid = ([x, y]) => x >= 0 && x < col && y >= 0 && y < row && status[index(x, y)] === UNDISCOVERED,
    popRandom = (array) => {
      const index = random(0, array.length) | 0;
      return array.splice(index, 1)[0];
    };

  while (queue.length) {
    const [x, y] = popRandom(queue);
    if (status[index(x, y)] === UNDISCOVERED) {
      status[index(x, y)] = DISCOVERED;
      const around = [
        [x - 1, y],
        [x + 1, y],
        [x, y - 1],
        [x, y + 1],
      ];

      d3.shuffle(around.filter(isValid)).forEach(([x0, y0]) => {
        const weight = Math.random();
        graph.addEdge(index(x, y), index(x0, y0), weight);
        graph.addEdge(index(x0, y0), index(x, y), weight);
        queue.push([x0, y0]);
      });
    }
  }
  return graph;
};

export const configSetup = (traverse) => {
  return ({ctx, width, height}) => {
    const {cellCol, cellRow} = grid(width, height, 20);
    const graph = getVisGraph(cellRow, cellCol);
    const vertices = [],
      startV = random(0, cellCol * cellRow) | 0,
      step = (v, status) => {
        (status === 1 || status === undefined) &&
          vertices.push({
            v,
            status,
          });
      };

    traverse(graph, startV, {
      step,
    });

    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, width, height);
    return vertices;
  };
};

export const update = ({frameCount, data: vertices}) => {
  if (frameCount > vertices.length - 2) return true;
};

export const draw = ({ctx, width, height, imageData, data: vertices, frameCount}) => {
  const {cellCol, cellRow, cellWidth, cellHeight} = grid(width, height, 20);
  const xy = (index) => ({
    x: index % cellCol,
    y: (index / cellCol) | 0,
  });
  const {v} = vertices[frameCount];
  const {x, y} = xy(v);
  const [r, g, b, a] = getImageData(imageData, cellRow, cellCol, v);
  const style = `rgba(${r}, ${g}, ${b}, ${a})`;
  const ratio = map(frameCount, 0, vertices.length, 2, 1.2);
  ctx.beginPath();
  ctx.fillStyle = style;
  ctx.arc(
    x * cellWidth + cellWidth / 2,
    y * cellHeight + cellHeight / 2,
    (Math.max(cellWidth, cellHeight) / 2) * ratio,
    0,
    Math.PI * 2,
    true
  );
  ctx.fill();
};
