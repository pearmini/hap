import Graph from '../Graph';

describe('Graph', () => {
  it('should init graph', () => {
    const g = new Graph();

    expect(g.edgeSize()).toBe(0);
    expect(g.vertexSize()).toBe(0);
  });

  it('should addEdge', () => {
    const g = new Graph();
    g.addEdge('A', 'B', 2);
    g.addEdge('B', 'A', 2);

    g.addEdge('A', 'C', 0);
    g.addEdge('C', 'A', 0);

    expect(g.edgeSize()).toBe(4);
    expect(g.vertexSize()).toBe(3);
    expect(g.getEdgeByVertex('A').length).toBe(2);

    expect(g.firstNbr('A')).toBe('B');
    expect(g.nextNbr('A', 'B')).toBe('C');
    expect(g.nextNbr('A', 'C')).toBeNull();
  });
});
