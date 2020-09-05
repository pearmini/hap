import Graph from '../data-structures/graph/Graph';

const graph = new Graph();

graph.addEdge('a', 'b', 4);
graph.addEdge('b', 'a', 4);

graph.addEdge('b', 'h', 11);
graph.addEdge('h', 'b', 11);

graph.addEdge('a', 'h', 8);
graph.addEdge('h', 'a', 8);

graph.addEdge('b', 'c', 8);
graph.addEdge('c', 'b', 8);

graph.addEdge('h', 'i', 7);
graph.addEdge('i', 'h', 7);

graph.addEdge('i', 'c', 2);
graph.addEdge('c', 'i', 2);

graph.addEdge('c', 'd', 7);
graph.addEdge('d', 'c', 7);

graph.addEdge('c', 'f', 4);
graph.addEdge('f', 'c', 4);

graph.addEdge('i', 'g', 6);
graph.addEdge('g', 'i', 6);

graph.addEdge('h', 'g', 1);
graph.addEdge('g', 'h', 1);

graph.addEdge('g', 'f', 2);
graph.addEdge('f', 'g', 2);

graph.addEdge('f', 'd', 14);
graph.addEdge('d', 'f', 14);

graph.addEdge('d', 'e', 9);
graph.addEdge('e', 'd', 9);

graph.addEdge('e', 'f', 10);
graph.addEdge('f', 'e', 10);

export default graph;
