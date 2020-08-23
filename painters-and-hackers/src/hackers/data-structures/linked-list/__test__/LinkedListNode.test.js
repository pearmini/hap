import LinkedListNode from '../LinkedListNode';

describe('LinkedListNode', () => {
  it('should insert new node after current node', () => {
    const linkedListNode = new LinkedListNode(1);
    linkedListNode.insertAsSucc(2);
    expect(linkedListNode.succ.data).toBe(2);
  });

  it('should insert new node before current node', () => {
    const linkedListNode = new LinkedListNode(1);
    linkedListNode.insertAsPred(2);
    expect(linkedListNode.pred.data).toBe(2);
  });
});
