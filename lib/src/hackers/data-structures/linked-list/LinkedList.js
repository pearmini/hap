import LinkedListNode from './LinkedListNode';

export default class LinkedList {
  constructor() {
    this.header = new LinkedListNode();
    this.trailer = new LinkedListNode();
    this.header.succ = this.trailer;
    this.trailer.pred = this.header;
    this._size = 0;
  }

  first() {
    return this.header.next;
  }

  last() {
    return this.trailer.pred;
  }

  get(rank) {
    if (rank < 0 || rank >= this._size) return null;
    let node = this.first();
    while (0 < rank--) node = node.succ;
    return node.data;
  }

  set(rank, data) {
    if (rank < 0 || rank >= this._size)
      throw new Error('list index out of bounds');
    let node = this.first();
    while (0 < rank--) node = node.succ;
    node.data = data;
  }

  append(data) {
    this._size++;
    this.trailer.insertAsPred(data);
  }

  unshift(data) {
    this._size++;
    this.header.insertAsSucc(data);
  }

  insert(node, data) {
    node.insertAsNext(data);
    this._size++;
  }

  remove(node) {
    this._size--;
    node.pred.succ = node.succ;
    node.succ.pred = node.pred;
    return node.data;
  }

  isEmpty() {
    return this._size <= 0;
  }

  traverse(visit) {
    for (let p = this.first(); p != this.trailer; p = p.succ) {
      visit(p.data);
    }
  }

  size() {
    return this._size;
  }

  toString(callback) {
    const list = [];
    this.traverse((data) => {
      const nodeStr = callback ? callback(data) : `${data}`;
      list.push(nodeStr);
    });
    return list.join(',');
  }
}
