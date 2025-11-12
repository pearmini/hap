import Vector from '../vector/Vector';

export default class Stack extends Vector {
  constructor() {
    super();
  }

  push(element) {
    this.append(element);
  }

  pop() {
    return this.size() ? this.remove(this.size() - 1) : null;
  }

  top() {
    if (this.size() === 0) return null;
    return this.get(this.size() - 1);
  }
}
