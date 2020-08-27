import picturesModel from './model';

const app = getApp();
Page({
  data: {
    list: [],
    pageWidth: 0,
    isBack: false,
    index: 0,
    labels: [],
    queryLabel: '',
    queryText: '',
    isLoading: false,
  },

  onLoad: async function (options) {
    wx.showLoading({
      title: '下载中...',
    });
    this.setData({
      isLoading: true,
    });
    const data = await picturesModel.get();
    const {result} = await picturesModel.getLabels();
    const {windowWidth} = wx.getSystemInfoSync();
    const length = ((data.length / 3) | 0) * 3;
    this.setData({
      list: data.slice(0, length),
      pageWidth: windowWidth,
      index: this.data.index + data.length,
      labels: result,
      isLoading: false,
    });
    wx.hideLoading();
  },

  onReachBottom: async function () {
    const data = await picturesModel.get(
      this.data.index,
      this.data.queryText,
      this.data.queryLabel
    );
    if (data.length === 0) {
      wx.showToast({
        title: '没有更多啦～',
        icon: 'none',
      });
      return;
    }
    const length = (((this.data.list.length + data.length) / 3) | 0) * 3;
    this.setData({
      list: [...this.data.list, ...data].slice(0, length),
      index: this.data.index + data.length,
    });
  },

  handleClickImage: async function (e) {
    if (this.data.isBack) return;
    wx.showLoading({
      title: '下载图片中...',
    });
    this.setData({
      isBack: true,
    });
    const {index} = e.target.dataset;
    const [, imageFileId, item] = this.data.list[index];
    const {tempFilePath} = await picturesModel.downloadImage(imageFileId);
    wx.hideLoading();
    app.globalData.selectedViewImagePath = tempFilePath;
    app.globalData.selectedItem = item;
    app.globalData.isBackFromPictures = true;
    wx.navigateBack();
  },

  handleConfirm: async function (e) {
    const {value} = e.detail;
    if (value === '') {
      wx.showToast({
        title: '不能为空',
        icon: 'none',
      });
      return;
    }
    this.setData({
      queryText: value,
    });
    const index = 0;
    const data = await picturesModel.get(index, value);
    this.setData({
      index: index + data.length,
      list: data,
    });
  },

  handleClear: async function () {
    const index = 0;
    const queryText = '';
    const data = await picturesModel.get(
      index,
      queryText,
      this.data.queryLabel
    );
    this.setData({
      index: index + data.length,
      list: data,
      queryText,
    });
  },

  handleClickLabel: async function (e) {
    const {label} = e.target.dataset;
    const index = 0;
    const queryLabel = this.data.queryLabel === label ? '' : label;
    const data = await picturesModel.get(
      index,
      this.data.queryText,
      queryLabel
    );
    this.setData({
      list: data,
      queryLabel,
    });
  },
});
