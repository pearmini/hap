import { GoodsModel } from "../../models/goods.js";
import { LabelsModel } from "../../models/labels.js";

const goodsModel = new GoodsModel();
const labelsModel = new LabelsModel();

Page({
  data: {
    goods: [],
    labels: [],
    selectedItem: null,
    type: "",
    selectedLabels: [],
    loading: true,
    index: 0
  },

  onLoad: function(options) {
    this.data.type = options.type;
    const goods = goodsModel.get(this.data.type, this.data.index);
    const labels = labelsModel.get(this.data.type);
    Promise.all([goods, labels]).then(res => {
      this.setData({
        goods: res[0].data,
        labels: res[1].data,
        loading: false
      });
    });
  },

  goodChange(e) {
    const index = e.detail.value;
    this.data.selectedItem = this.data.goods[index];
  },

  labelChange(e) {
    this.data.selectedLabels = e.detail.value;
  },

  updateGoods() {
    wx.showLoading({
      title: "加载中"
    });
    this.data.index = 0;
    const goods = goodsModel.get(
      this.data.type,
      this.data.index,
      this.data.selectedLabels
    );
    goods.then(res => {
      this.setData({
        goods: res.data
      });
      wx.hideLoading();
    });
  },

  onConfirm(e) {
    if (!this.data.selectedItem) {
      wx.lin.showMessage({
        content: "请做出选择",
        type: "error"
      });
      return;
    }
    const pages = getCurrentPages();
    const prePage = pages[pages.length - 2];

    if (this.data.type === "img") {
      prePage.setData({
        selectedImg: this.data.selectedItem
      });
    } else if (this.data.type === "stroke") {
      prePage.setData({
        selectedStroke: this.data.selectedItem
      });
    } else {
      prePage.setData({
        selectedSample: this.data.selectedItem
      });
    }

    wx.navigateBack({
      delta: 1
    });
  },

  showDetail(e) {
    const index = e.currentTarget.dataset.index;
    const id = this.data.goods[index]._id;
    wx.navigateTo({
      url: `../detail/index?id=${id}`
    });
  },

  onTagChange(e) {
    const indexList = e.detail.list;
    this.data.selectedLabels = indexList.map(
      index => this.data.labels[index].value
    );
    this.updateGoods();
  },

  onReachBottom(e) {
    wx.showLoading({
      title: "加载中"
    });
    this.data.index++;
    const goods = goodsModel.get(
      this.data.type,
      this.data.index,
      this.data.selectedLabels
    );
    goods.then(res => {
      if (res.data.length === 0) {
        wx.lin.showMessage({
          content: "没有更多啦～",
          type: "warning"
        });
      } else {
        this.setData({
          goods: [...this.data.goods, ...res.data]
        });
      }
      wx.hideLoading();
    });
  }
});
