import LinkedListNode from './LinkedListNode';

export default class LinkedList {
  constructor() {
    this.header = this.tail = new LinkedListNode();
    this._size = 0;
  }

  append(element) {
    let current = this.header;
    const node = new LinkedListNode(element);
    while (current.next) current = current.next;
    current.next = node;
    node.next = this.tail;
    this._size++;
  }

  insert(rank, element) {
    if (rank >= this._size) return;
    let current = this.header;
    let nextIndex = 0;
    while (current.next) {
      if (nextIndex === rank) {
        const node = new LinkedListNode(element);
        node.next = current.next;
        current.next = node;
        this._size++;
        return;
      }
      nextIndex++;
    }
  }

  remove(rank) {
    if (rank >= this._size) return;
    let current = this.header;
    let nextIndex = 0;
    while (current.next) {
      if (nextIndex === rank) {
        const next = current.next;
        current.next = next.next;
        this._size--;
        return next;
      }
      nextIndex++;
    }
  }

  size() {
    return this._size;
  }
}
