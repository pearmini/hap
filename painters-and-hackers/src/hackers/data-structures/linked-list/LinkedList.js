import LinkedListNode from './LinkedListNode';

export default class LinkedList {
  constructor() {
    this.header = new LinkedListNode();
    this.trailer = new LinkedListNode();
    this.header.next = this.trailer;
    this._size = 0;
  }

  first() {
    return this.header.next;
  }

  get(rank) {
    if (rank < 0 || rank >= this._size) return null;
    let node = this.first();
    while (0 < rank--) node = node.next;
    return node.data;
  }

  set(rank, data) {
    if (rank < 0 || rank >= this._size)
      throw new Error('list index out of bounds');
    let node = this.first();
    while (0 < rank--) node = node.next;
    node.data = data;
  }

  insert(node, data) {
    node.insertAsNext(data);
  }

  remove(node) {
    return node.deleteNext();
  }

  isEmpty() {
    return this._size <= 0;
  }

  traverse(callback) {
    let node = this.header;
    while (node) {
      callback(node.data);
      node = node.next;
    }
  }

  size() {
    return this._size;
  }

  toString(callback) {
    let value = '';
    this.traverse((data) => {
      const nodeString = callback ? callback(data) : `${data}`;
      value += `${nodeString},`;
    });
    return value.slice(0, value.length - 1);
  }
}
