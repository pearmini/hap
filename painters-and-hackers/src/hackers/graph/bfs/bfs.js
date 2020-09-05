function bfs(graph, v, options = {}) {
  const {step} = options;
  const VISITED = 2,
    DISCOVERED = 1,
    UNDISCOVERED = 0;

  const queue = [];
  const status = new Map(graph.getVertices().map((d) => [d, UNDISCOVERED]));

  queue.push(v);
  status.set(v, DISCOVERED);
  step && step(v, DISCOVERED);

  while (queue.length) {
    const v = queue.shift();
    for (let u = graph.firstNbr(v); u; u = graph.nextNbr(v, u)) {
      if (status.get(u) === UNDISCOVERED) {
        status.set(u, DISCOVERED);
        queue.push(u);
        step && step(u, DISCOVERED);
      }
    }
    status.set(v, VISITED);
    step && step(v, VISITED);
  }
}

export default bfs;
