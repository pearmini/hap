class Vertex {
  constructor(key) {
    this.key = key;
    this.edgeIndexes = [];
  }

  addEdge(edgeIndex) {
    this.edgeIndexes.push(edgeIndex);
  }

  edges() {
    return this.edgeIndexes;
  }
}

export default Vertex;
