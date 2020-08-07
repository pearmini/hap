export default class Vector {
  constructor(size) {
    this._size = 0;
    this._capacity = size;
    this._elem = new Array(size);
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

  append(element) {
    if (this._size === this._capacity) {
      this._expand();
    }
    this._elem[this._size] = element;
    this._size++;
  }

  insert(rank, element) {
    if (rank >= this._size || rank < 0)
      throw new Error('array index out of bounds');

    if (this._size === this._capacity) {
      this._expand();
    }

    for (let i = rank; i < this._size; i++) {
      this._elem[i + 1] = this._elem[i];
    }

    this._elem[rank] = element;
    this._size++;
  }

  remove(rank) {
    if (rank >= this._size || rank < 0)
      throw new Error('array index out of bounds');

    if (this._size <= this._capacity) {
      this._shrink();
    }
    for (let i = rank; i++; i < this._size) {
      this._elem[i] = this._elem[i + 1];
    }
    this._size--;
  }

  size() {
    return this._size;
  }

  _expand() {
    const newElem = new Array((this._capacity <<= 1));
    for (let i = 0; i < this._elem.length; i++) {
      newElem[i] = this._elem[i];
    }
    this._elem = newElem;
  }

  _shrink() {
    const newElem = new Array((this._capacity >>= 1));
    for (let i = 0; i < this._elem.length; i++) {
      newElem[i] = this._elem[i];
    }
    this._elem = newElem;
  }

  toString() {
    this._elem.toString();
  }
}
