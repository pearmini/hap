import {getVisGraph} from '../index';

describe('getVisGraph', () => {
  it('should generate a new graph', () => {
    const graph = getVisGraph(10, 10);
    expect(graph.getVertices().length).toBe(100);
  });
});
