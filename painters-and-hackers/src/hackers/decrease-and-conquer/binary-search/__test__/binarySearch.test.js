import {bisectLeft, bisectRight} from '../binarySearch';

describe('binarySearch', () => {
  it('should search number in sorted array', () => {
    expect(bisectLeft([], 1)).toBe(0);
    expect(bisectLeft([1], 1)).toBe(0);
    expect(bisectLeft([1, 2], 1)).toBe(0);
    expect(bisectLeft([1, 2], 2)).toBe(1);
    expect(bisectLeft([1, 5, 5, 5, 5, 10, 12], 5)).toBe(1);
    expect(bisectLeft([1, 5, 10, 12, 14, 17, 22, 100], 17)).toBe(5);
    expect(bisectRight([1, 5, 5, 5, 5, 10, 12], 5)).toBe(5);
  });

  it('should search object in sorted array', () => {
    const sortedArrayOfObjects = [
      {key: 1, value: 'value1'},
      {key: 2, value: 'value2'},
      {key: 3, value: 'value3'},
    ];

    const compare = (a, b) => a.key - b.key;
    expect(bisectLeft([], {key: 1}, compare)).toBe(0);
    expect(bisectLeft(sortedArrayOfObjects, {key: 4}, {compare})).toBe(3);
    expect(bisectLeft(sortedArrayOfObjects, {key: 1}, {compare})).toBe(0);
    expect(bisectLeft(sortedArrayOfObjects, {key: 2}, {compare})).toBe(1);
    expect(bisectLeft(sortedArrayOfObjects, {key: 3}, {compare})).toBe(2);
  });
});
