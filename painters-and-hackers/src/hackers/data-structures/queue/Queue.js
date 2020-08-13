import Vector from '../vector/Vector';

export default class Queue extends Vector {
  constructor() {
    super();
  }

  enqueue(element) {
    this.append(element);
  }

  dequeue(element){

  }

  front(){

  }
  
  pop() {
    return this.remove(0);
  }
}
