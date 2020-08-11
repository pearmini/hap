import Vector from '../vector/Vector';

export default class Stack extends Vector {
  constructor() {
    super();
  }

  push(element) {
    this.append(element);
  }

  pop() {
    const size = this.size();
    if (size === 0) return;
    return this.remove(size - 1);
  }

  size() {
    return this.size();
  }
}
