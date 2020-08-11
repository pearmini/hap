import Vector from '../Vector';

describe('Vector', () => {
  it('append', () => {
    const vector = new Vector(1);
    vector.append(1);
    expect(vector.get(0)).toBe(1);
    expect(vector.size()).toBe(1);

    vector.append(3);
    expect(vector._capacity).toBe(20);
  });

  it('insert', () => {
    const vector = new Vector(3);
    vector.append(1);
    vector.append(2);
    vector.append(3);

    vector.insert(2, 5);
    expect(vector.get(2)).toBe(5);
    expect(vector.size()).toBe(4);
    expect(vector._capacity).toBe(20);
  });

  it('remove', () => {
    const vector = new Vector(3);
    vector.append(1);
    vector.append(2);

    vector.remove(0);
    expect(vector.get(0)).toBe(2);
    expect(vector.size()).toBe(1);
    expect(vector._capacity).toBe(3);
  });
});
