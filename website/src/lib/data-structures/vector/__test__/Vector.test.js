import Vector from '../Vector';

describe('Vector', () => {
  it('should append element to data', () => {
    const vector = new Vector(1);
    vector.append(1);
    vector.append(2);

    expect(vector.toString()).toBe('1,2');
    expect(vector._capacity).toBe(20);
  });

  it('should insert element into data by rank', () => {
    const vector = new Vector(3);
    vector.append(1);
    vector.append(2);
    vector.append(3);
    vector.append(4);

    vector.insert(2, 5);
    expect(vector.toString()).toBe('1,2,5,3,4');
    expect(vector._capacity).toBe(20);
  });

  it('should remove element from data by rank', () => {
    const vector = new Vector(3);
    vector.append(1);
    vector.append(2);
    vector.append(3);

    vector.remove(1);
    expect(vector.toString()).toBe('1,3');
    expect(vector._capacity).toBe(3);
  });

  it('should double its capacity when size exceeds capacity', () => {
    const vector = new Vector(3);
    for (let i = 0; i < 10; i++) {
      vector.append(i);
    }
    expect(vector._capacity).toBe(20);

    for (let i = 0; i < 11; i++) {
      vector.append(i);
    }
    expect(vector._capacity).toBe(40);
  });

  it('should shrink its capacity when size is smaller than capacity / 4', () => {
    const vector = new Vector(3);
    for (let i = 0; i < 21; i++) {
      vector.append(i);
    }
    expect(vector._capacity).toBe(40);

    for (let i = 0; i < 12; i++) {
      vector.remove(0);
    }
    expect(vector._capacity).toBe(20);
  });
});
