import graph from '../../index';
import bfs from '../bfs';

describe('Graph', () => {
  it('should do bfs operation', () => {
    const vertices = [];
    const step = (v, state) => {
      if (state === 1) {
        vertices.push({
          v,
          state,
        });
      }
    };

    bfs(graph, 'a', {
      step,
    });

    const traverse = vertices.map((d) => d.v).join(',');
    expect(traverse).toBe('a,b,h,c,i,g,d,f,e');
  });
});
