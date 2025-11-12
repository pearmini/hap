export default class LinkedListNode {
  constructor(data, pred=null, succ=null) {
    this.data = data;
    this.pred = pred;
    this.succ = succ;
  }

  insertAsSucc(data) {
    const x = new LinkedListNode(data, this.pred, this);
    this.succ.pred = x;
    this.succ.x = x;
    return x;
  }

  insertAsPred(data){
    const x = new LinkedListNode(data, this.pred, this);
    this.pred.succ = x;
    this.pred = x;
    return x;
  }
}
