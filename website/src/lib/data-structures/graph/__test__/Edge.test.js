import Edge from '../Edge';

describe('Edge', () => {
  it('should init edge', () => {
    const e = new Edge('A', 'B');
    expect(e.from).toBe('A');
    expect(e.to).toBe('B');
    expect(e.weight).toBe(0);
  });
});
