import Vertex from '../Vertex';

describe('Vertex', () => {
  it('should init vertex', () => {
    const v = new Vertex('A');
    expect(v.key).toBe('A');
    expect(v.edgeIndexes.length).toBe(0);
  });

  it('shoud add edges', () => {
    const v = new Vertex('A');
    v.addEdge(0);
    v.addEdge(1);

    const edges = v.edges()
    expect(edges[0]).toBe(0);
    expect(edges[1]).toBe(1);
  });
});
