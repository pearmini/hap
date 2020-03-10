import { DBModel } from "./db.js";

class GoodsModel extends DBModel {
  constructor() {
    super();
    this.dbname = "goods";
  }
  get(type, index, labels = []) {
    const _ = this.db.command;
    const order = type === "img" ? "_id" : "weight";
    if (labels.length === 0) {
      return this.db
        .collection(this.dbname)
        .where({
          type,
          valid: 1,
          fileid: _.neq("#")
        })
        .orderBy(order, "desc")
        .skip(index * 20)
        .get();
    } else {
      const args = [];
      for (let l of labels) {
        args.push(_.eq(l));
      }
      return this.db
        .collection(this.dbname)
        .where({
          type,
          valid: 1,
          fileid: _.neq("#"),
          labels: _.and(...args)
        })
        .orderBy(order, "desc")
        .skip(index * 20)
        .get();
    }
  }

  getById(id) {
    return this.db
      .collection(this.dbname)
      .where({
        _id: id
      })
      .get();
  }

  getVisData() {
    const $ = this.db.command.aggregate;
    return this.db
      .collection(this.dbname)
      .aggregate()
      .group({
        _id: "$type",
        num: $.sum(1)
      })
      .end();
  }

  getCurrent() {
    return this.db
      .collection(this.dbname)
      .where({
        type: "img_index"
      })
      .get()
      .then(res => {
        const id = res.data[0].cur;
        return this.db
          .collection(this.dbname)
          .where({
            id
          })
          .get();
      });
  }

  getNext(item) {
    const next = item.next;
    if (next === -1) {
      return new Promise((resolve, reject) => {
        const res = -1;
        resolve(res);
      });
    }
    return this.updateInfo({
      cur: next
    }).then(res => {
      return this.db
        .collection(this.dbname)
        .where({
          id: next
        })
        .get();
    });
  }

  getPrevious(item) {
    const previous = item.previous;
    if (previous === -1) {
      return new Promise((resolve, reject) => {
        const res = -1;
        resolve(res);
      });
    }
    return this.updateInfo({
      cur: previous
    }).then(res => {
      return this.db
        .collection(this.dbname)
        .where({
          id: previous
        })
        .get();
    });
  }

  updateInfo(data) {
    return wx.cloud.callFunction({
      name: "updateInfo",
      data: {
        data
      }
    });
  }

  getInfo() {
    return this.db
      .collection(this.dbname)
      .where({
        type: "img_index"
      })
      .get();
  }

  delete(item) {
    const next = item.next;
    const previous = item.previous;
    let cur = next === -1 ? previous : next; // 不可能全部都删没了
    return this.updateGood(previous, {
      next
    }) // 修改前一个元素
      .then(res => {
        return this.updateGood(next, {
          previous
        }); // 修改后一个元素
      })
      .then(res => {
        return this.getInfo(); // 获得当前的长度
      })
      .then(res => {
        const cnt = res.data[0].cnt;
        return this.updateInfo({
          cnt: cnt - 1,
          cur: cur //更新长度
        });
      })
      .then(res => {
        // 标记为没有效果
        return this.updateGood(item.id, {
          valid: 0
        });
      });
  }

  updateGood(id, data) {
    return wx.cloud.callFunction({
      name: "updateGood",
      data: {
        id,
        data
      }
    });
  }

  getInfoByKey(key) {
    return wx.cloud.callFunction({
      name: "getIntro",
      data: {
        key
      }
    });
  }
}

export { GoodsModel };
