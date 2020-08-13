export default class LinkedListNode {
  constructor(data) {
    this.data = data;
    this.next = null;
  }

  insertAsNext(data) {
    const node = new LinkedListNode(data);
    node.next = this.next;
    this.next = node;
  }

  deleteNext() {
    const deleteNode = this.next;
    this.next = deleteNode.next;
    return deleteNode.data;
  }
}
