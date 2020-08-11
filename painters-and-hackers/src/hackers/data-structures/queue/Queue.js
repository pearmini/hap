import Vector from '../vector/Vector';

export default class Queue extends Vector {
  constructor() {
    super();
  }

  push(element) {
    this.append(element);
  }

  pop() {
    return this.remove(0);
  }

  size() {
    return this.size();
  }
}
