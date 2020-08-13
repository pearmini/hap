import LinkedListNode from '../LinkedListNode';

describe('LinkedListNode', () => {
  it('should insert new node after current node', () => {
    const linkedListNode = new LinkedListNode(1);
    linkedListNode.insertAsNext(2);
    expect(linkedListNode.next.data).toBe(2);
  });

  it('should delete old node after current node', () => {
    const linkedListNode = new LinkedListNode(1);
    linkedListNode.insertAsNext(2);
    const data = linkedListNode.deleteNext();
    expect(data).toBe(2);
    expect(linkedListNode.next).toBeNull();
  });
});
