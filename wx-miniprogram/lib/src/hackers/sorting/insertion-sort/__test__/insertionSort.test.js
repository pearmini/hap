import test from '../../tester';
import insertionSort from '../insertionSort';

describe('insertion sort', () => {
  it('should sort array', () => {
    test(insertionSort);
  });
});
