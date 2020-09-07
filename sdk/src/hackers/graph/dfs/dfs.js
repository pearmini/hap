function dfs(graph, s, options = {}) {
  const {step} = options;
  const UNDISCOVERED = 0,
    DISCOVERED = 1,
    VISITED = 2;

  const status = new Map(graph.getVertices().map((d) => [d, UNDISCOVERED]));
  DFS(s);

  function DFS(v) {
    status.set(v, DISCOVERED);
    step && step(v, DISCOVERED);
    for (let u = graph.firstNbr(v); u !== null; u = graph.nextNbr(v, u)) {
      if (status.get(u) === UNDISCOVERED) DFS(u);
      status.set(v, VISITED);
      step && step(v, VISITED);
    }
  }
}

export default dfs;
