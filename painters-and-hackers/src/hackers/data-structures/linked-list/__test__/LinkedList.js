import LinkedList from '../LinkedList';

describe('LinkedList', () => {
  
  it('should create empty linked list', () => {
    const linkedList = new LinkedList();
    expect(linkedList.toString()).toBe('');
  });

  it('should get data from linked list by rank', () => {
    const linkedList = new LinkedList();

    linkedList.append(1);
    linkedList.append(2);

    expect(linkedList.get(1)).toBe(2);
  });

  it('should append node to linked list', () => {
    const linkedList = new LinkedList();

    linkedList.append(1);
    linkedList.append(2);

    expect(linkedList.toString()).toBe('1,2');
  });

  it('should insert node to linked list', () => {
    const linkedList = new LinkedList();

    linkedList.append(1);
    linkedList.append(2);
    linkedList.insert(1, 5);

    expect(linkedList.toString()).toBe('1,5,2');
  });

  it('should delete node from linked list by rank', () => {
    const linkedList = new LinkedList();

    linkedList.append(1);
    linkedList.append(2);

    const deleteData = linkedList.remove(0);
    expect(deleteData).toBe(1);
    expect(linkedList.toString()).toBe('2');
  });
});
