import { ArtworksModel } from "../../models/artworks.js";
import { FileModel } from "../../models/files.js";
import { login } from "../../util/util.js";
const artworksModel = new ArtworksModel();
const fileModel = new FileModel();
Page({
  data: {
    artworks: [],
    loading: true,
    deleting: false,
    openid: "",
    index: 0,
    defaultShareImageUrl:
      "https://7765-wechatcloud-79m2p-1259642785.tcb.qcloud.la/assets/wxfa468967fadbc4a5.o6zAJs_1ObMKghQped4qZRpgJbbw.2Ayw0fSIVmXHda444a3387f72b78cb32ebd4d91b8c36.png?sign=723b2b23be1518348048a8d465b0ab00&t=1565831746"
  },

  onLoad: function(options) {
    this.setData({
      loading: true
    });
    let artworks = null;
    this.data.index = 0;
    login()
      // 获得openid
      .then(res => {
        const openid = res.result.openid;
        this.data.openid = openid;
        return artworksModel.get(openid, this.data.index);
      })
      // 根据获得openid获得fileid
      .then(res => {
        artworks = res.data;
        const files = [];
        for (let a of artworks) {
          files.push(fileModel.get(a.fileid));
        }
        return Promise.all(files);
      })
      // 根据获得fileid获得path
      .then(res => {
        artworks.map((item, index) => {
          item.path = res[index].tempFilePath;
          return item;
        });
        this.setData({
          artworks,
          loading: false
        });
      });
  },

  onShow() {
    const refresh = wx.getStorageSync("refresh");
    wx.removeStorageSync("refresh");
    if (refresh) {
      this.data.index = 0;
      this.onLoad();
    }
  },

  onReachBottom(e) {
    wx.showLoading({
      title: "加载中"
    });
    this.data.index++;
    let artworks = null;
    artworksModel
      .get(this.data.openid, this.data.index)
      .then(res => {
        artworks = res.data;
        const files = [];
        for (let a of artworks) {
          files.push(fileModel.get(a.fileid));
        }
        return Promise.all(files);
      })
      // 根据获得fileid获得path
      .then(res => {
        if (artworks.length === 0) {
          wx.lin.showMessage({
            content: "没有更多啦～",
            type: "warning"
          });
        } else {
          artworks.map((item, index) => {
            item.path = res[index].tempFilePath;
            return item;
          });

          this.setData({
            artworks: [...this.data.artworks, ...artworks]
          });
        }
        wx.hideLoading();
      });
  },

  onShowDelete(e) {
    const index = e.target.dataset.index;
    wx.lin.showDialog({
      type: "confirm",
      title: "提示",
      content: "确定删除？",
      success: res => {
        if (res.confirm) {
          this.delete(index);
        } else if (res.cancel) {
          console.log("用户点击取消");
        }
      }
    });
  },

  delete(index) {
    // 获得删除数据的索引
    wx.showLoading({
      title: "删除中"
    });
    const artwork = this.data.artworks[index];

    //删除数据
    const p1 = artworksModel.delete(artwork._id);
    const p2 = fileModel.delete(artwork.fileid);
    Promise.all([p1, p2]).then(res => {
      //更新数据
      this.data.artworks.splice(index, 1);
      this.setData({
        artworks: this.data.artworks
      });
      wx.hideLoading();
      wx.lin.showMessage({
        content: "删除成功",
        type: "success"
      });
    });
  },

  saveImageToLocal(e) {
    wx.saveImageToPhotosAlbum({
      filePath: e.target.id,
      success(res) {}
    });
  },

  onCreate(e) {
    wx.switchTab({
      url: "../draw/draw"
    });
  },

  onDetail(e) {
    const id = e.target.dataset.id;
    wx.navigateTo({
      url: `../detail/detail?id=${id}`
    });
  },

  onPullDownRefresh() {
    this.onLoad();
  },

  onShareAppMessage(e) {
    if (e.from === "button") {
      const path = e.target.dataset.path;
      return {
        title: "快来涂鸦上海吧！",
        imageUrl: path
      };
    } else {
      return {
        title: "快来涂鸦上海吧！",
        imageUrl: this.data.defaultShareImageUrl
      };
    }
  }
});
