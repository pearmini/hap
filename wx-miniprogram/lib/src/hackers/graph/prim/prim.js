import minHeap from '../../data-structures/heap/Heap';

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

export default prim;
