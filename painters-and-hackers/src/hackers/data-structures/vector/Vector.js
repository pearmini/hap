export default class Vector {
  constructor(capacity) {
    this._DEFAULT_CAPACITY = 10;
    this._size = 0;
    this._capacity = capacity || this._DEFAULT_CAPACITY;
    this._elem = new Array(capacity);
  }

  get(rank) {
    if (rank >= this._size || rank < 0)
      throw new Error('array index out of bounds');
    return this._elem[rank];
  }

  put(rank, element) {
    if (rank >= this._size || rank < 0)
      throw new Error('array index out of bounds');
    this._elem[rank] = element;
  }

  insert(rank, element) {
    if (rank > this._size || rank < 0)
      throw new Error('array index out of bounds');

    this._expand();
    for (let i = rank; i < this._size; i++) {
      this._elem[i + 1] = this._elem[i];
    }
    this._elem[rank] = element;
    this._size++;
  }

  remove(rank) {
    if (rank >= this._size || rank < 0)
      throw new Error('array index out of bounds');

    this._shrink();
    const deleteElement = this._elem[rank];
    for (let i = rank; i < this._size; i++) {
      this._elem[i] = this._elem[i + 1];
    }
    this._size--;
    return deleteElement;
  }

  append(element) {
    this.insert(this._size, element);
  }

  size() {
    return this._size;
  }

  isEmpty() {
    return this._size <= 0;
  }

  toString() {
    return this._elem.join(',');
  }

  _expand() {
    if (this._size < this._capacity) return;
    this._capacity = Math.max(this._DEFAULT_CAPACITY, this._capacity);

    const newElem = new Array((this._capacity <<= 1));
    for (let i = 0; i < this._size; i++) {
      newElem[i] = this._elem[i];
    }
    this._elem = newElem;
  }

  _shrink() {
    if (this._capacity < this._DEFAULT_CAPACITY << 1) return;
    if (this._sise << 2 > this._capacity) return;

    const newElem = new Array((this._capacity >>= 1));
    for (let i = 0; i < this._size; i++) {
      newElem[i] = this._elem[i];
    }
    this._elem = newElem;
  }
}
