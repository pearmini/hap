import { DBModel } from "./db.js";

class ArtworksModel extends DBModel {
  get(openid, index) {
    return this.db
      .collection("artworks")
      .where({
        _openid: openid
      })
      .orderBy("time", "desc")
      .skip(index * 20)
      .get();
  }

  delete(id) {
    return this.db
      .collection("artworks")
      .doc(id)
      .remove();
  }

  add(fileid, rotate, info, time) {
    return this.db.collection("artworks").add({
      data: {
        fileid,
        rotate,
        img: info.img,
        stroke: info.stroke,
        sample: info.sample,
        time
      }
    });
  }
}

export { ArtworksModel };
