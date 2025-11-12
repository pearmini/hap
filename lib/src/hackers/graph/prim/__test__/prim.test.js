import {getTestGraph} from '../../index';
import prim from '../prim';

describe('Graph', () => {
  it('should do prim operation', () => {
    const vertices = [];
    const graph = getTestGraph();
    const step = (v) => {
      vertices.push(v);
    };

    prim(graph, 'a', {
      step,
    });

    const traverse = vertices.join(',');
    expect(traverse).toBe('a,b,c,i,f,g,h,d,e');
  });
});
