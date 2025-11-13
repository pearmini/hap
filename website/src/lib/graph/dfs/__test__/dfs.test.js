import {getTestGraph} from '../../index';
import dfs from '../dfs';

describe('Graph', () => {
  it('should do dfs operation', () => {
    const vertices = [];
    const graph = getTestGraph();
    const step = (v, state) => {
      if (state === 1) {
        vertices.push({
          v,
          state,
        });
      }
    };

    dfs(graph, 'a', {
      step,
    });

    const traverse = vertices.map((d) => d.v).join(',');
    expect(traverse).toBe('a,b,h,i,c,d,f,g,e');
  });
});
