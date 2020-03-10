import { ArtworksModel } from "../../models/artworks.js";
import { login } from "../../util/util.js";
import { LearnModel } from "../../models/learns.js";
import { GoodsModel } from "../../models/goods.js";
const learnModel = new LearnModel();
const artworksModel = new ArtworksModel();
const goodsModel = new GoodsModel();
Page({
  data: {
    artworks: null,
    learns: null,
    noWorks: true,
    noLearns: true,
    loading: false,
    circleData: [],
    pieDataList: [[], [], []],
    currentIndex: -1,
    currentTabIndex: 1,
    defaultShareImageUrl:
      "https://7765-wechatcloud-79m2p-1259642785.tcb.qcloud.la/assets/wxfa468967fadbc4a5.o6zAJs_1ObMKghQped4qZRpgJbbw.2Ayw0fSIVmXHda444a3387f72b78cb32ebd4d91b8c36.png?sign=723b2b23be1518348048a8d465b0ab00&t=1565831746"
  },

  onLoad() {
    this.showLearn(false);
  },

  onShow() {
    this.showLearn(true);
  },

  onGo() {
    wx.switchTab({
      url: "../draw/draw"
    });
  },

  onPullDownRefresh() {
    if (this.data.currentTabIndex === 1) {
      this.showLearn(true);
    } else {
      this.showWork(true);
    }
  },

  changeTabs(e) {
    const key = e.detail.activeKey;
    if (key === "one") {
      this.data.currentTabIndex = 1;
      this.showLearn(false);
    } else {
      this.data.currentTabIndex = 2;
      this.showWork(false);
    }
  },

  showLearn(isRefresh) {
    let learns, goods;
    if (isRefresh || this.data.learns === null) {
      wx.showLoading({
        title: "获取数据中"
      });
      this.setData({
        loading: true
      });
      login()
        .then(res => {
          // 获得openid
          const openid = res.result.openid;
          return learnModel.getVisData(openid);
        })
        .then(res => {
          // 获得所有商品信息
          learns = res;
          return goodsModel.getVisData();
        })
        .then(res => {
          // 获得已学习的商品信息
          goods = res.list;
          this.data.learns = this.getCircleVisData(goods, learns);
          this.visLearn(this.data.learns);
          wx.hideLoading();
          this.setData({
            loading: false
          });
        });
    } else {
      this.visLearn(this.data.learns);
    }
  },

  getCircleVisData(goods, learns) {
    if (learns.length !== 0) {
      this.setData({
        noLearns: false
      });
    } else {
      this.setData({
        noLearns: true
      });
    }

    const my = {
        stroke: 0,
        sample: 0,
        img: 0
      },
      all = {
        stroke: 0,
        sample: 0,
        img: 0
      };

    for (let l of learns) {
      my[l._id] += l.num;
    }

    for (let g of goods) {
      all[g._id] += g.num;
    }

    const data = [
      {
        name: "绘画风格",
        percent: ((my.stroke / all.stroke) * 100) | 0,
        bgColor: "#183C3D"
      },
      {
        name: "绘画方式",
        percent: ((my.sample / all.sample) * 100) | 0,
        bgColor: "#324214"
      },
      {
        name: "图片",
        percent: ((my.img / all.img) * 100) | 0,
        bgColor: "#40131D"
      }
    ];

    return data;
  },

  showWork(isRefresh) {
    if (isRefresh || this.data.artworks === null) {
      this.data.pieDataList = [[], [], []];
      wx.showLoading({
        title: "获取数据中"
      });
      this.setData({
        loading: true
      });
      login()
        .then(res => {
          const openid = res.result.openid;
          return artworksModel.get(openid);
        })
        .then(res => {
          wx.hideLoading();
          this.data.artworks = res.data;
          this.visWork(this.data.artworks);
          this.setData({
            loading: false
          });
        });
    } else {
      this.visWork(this.data.artworks);
    }
  },

  visLearn(data) {
    this.setData({
      circleData: data
    });
  },

  visWork(data) {
    if (data.length !== 0) {
      this.setData({
        noWorks: false
      });
    } else {
      this.setData({
        noWorks: true
      });
    }
    for (let d of data) {
      const { img, stroke, sample } = d;
      this.add(img, this.data.pieDataList[0]);
      this.add(stroke, this.data.pieDataList[1]);
      this.add(sample, this.data.pieDataList[2]);
    }
    this.setData({
      pieDataList: this.data.pieDataList,
      currentIndex: 0
    });
  },

  onLeft(e) {
    this.data.currentIndex--;
    this.updatePieChart();
  },

  onRight(e) {
    this.data.currentIndex++;
    this.updatePieChart();
  },

  updatePieChart() {
    this.setData({
      currentIndex: this.data.currentIndex
    });
  },

  add(element, array) {
    const index = this.indexOf(element, array);
    if (index === -1) {
      array.push({
        name: element[0],
        value: 1,
        a: "1"
      });
    } else {
      array[index].value++;
    }
  },
  indexOf(element, array) {
    let index = -1;
    for (let i = 0; i < array.length; i++) {
      if (array[i].name === element[0]) {
        return i;
      }
    }
    return index;
  },
  onShareAppMessage(e) {
    if (e.from === "button") {
      const path = e.target.dataset.path;
      console.log(path);
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
