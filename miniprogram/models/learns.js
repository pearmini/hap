import { DBModel } from "./db.js"

class LearnModel extends DBModel {
  get(openid, did) {
    return this.db.collection('learns').where({
      openid,
      did
    }).get();
  }

  add(openid, did, type) {
    return this.db.collection('learns').add({
      data: {
        openid,
        did,
        type
      }
    })
  }

  delete(openid, did) {
    return wx.cloud.callFunction({
      name: 'remove',
      data: {
        openid,
        did
      }
    })
  }

  getVisData(openid) {
    const $ = this.db.command.aggregate;
    return this.db.collection('learns')
      .where({
        openid
      }).get()
      .then(res => {
        const data = res.data,
          types = [],
          indexByType = {};
        for (let d of data) {
          const t = d.type,
            index = indexByType[t];
          if (index >= 0) {
            types[index].num++;
          } else {
            indexByType[t] = types.length;
            types.push({
              _id: t,
              num: 1
            })
          }
        }
        return new Promise((r, j) => {
          r(types);
        })
      })
  }

}

export { LearnModel }