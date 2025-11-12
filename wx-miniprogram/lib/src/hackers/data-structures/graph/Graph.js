import Edge from './Edge';
import Vertex from './Vertex';

class Graph {
  constructor() {
    this.edges = [];
    this.vertices = [];
  }

  addEdge(from, to, weight) {
    const next = this.edges.length;
    this.edges.push(new Edge(from, to, weight));
    const index = this.vertices.findIndex((d) => d.key === from);
    if (index === -1) {
      const v = new Vertex(from);
      v.addEdge(next);
      this.vertices.push(v);
    } else {
      this.vertices[index].addEdge(next);
    }
  }

  getEdgeByVertex(key) {
    const v = this.vertices.find((d) => d.key === key);
    const indexes = v ? v.edges() : [];
    return indexes.map((i) => this.edges[i]);
  }

  firstNbr(key) {
    const v = this.vertices.find((d) => d.key === key);
    const e = v.edges();
    return e.length ? this.edges[e[0]].to : null;
  }

  nextNbr(kv, ku) {
    const v = this.vertices.find((d) => d.key === kv);
    const e = v.edges();
    const index = e.findIndex((i) => this.edges[i].to === ku);
    return index < 0 || index + 1 >= e.length
      ? null
      : this.edges[e[index + 1]].to;
  }

  getVertices() {
    return this.vertices.map((d) => d.key);
  }

  edgeSize() {
    return this.edges.length;
  }

  vertexSize() {
    return this.vertices.length;
  }
}

export default Graph;
