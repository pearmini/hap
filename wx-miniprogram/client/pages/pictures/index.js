import picturesModel from './model';

const app = getApp();
Page({
  data: {
    list: [],
    pageWidth: 0,
    isBack: false,
  },

  onLoad: async function (options) {
    const {data} = await picturesModel.get();
    const {windowWidth} = wx.getSystemInfoSync();
    const newList = data.map(({imageURL, imageFileId, _id}) => ({
      imageURL,
      imageFileId,
      _id,
    }));
    this.setData({
      list: newList,
      pageWidth: windowWidth,
    });
  },

  handleClickImage: async function (e) {
    if (this.data.isBack) return;
    this.setData({
      isBack: true,
    });
    const {index} = e.target.dataset;
    const {imageFileId} = this.data.list[index];
    const {tempFilePath} = await picturesModel.downloadImage(imageFileId);
    app.globalData.selectedViewImagePath = tempFilePath;
    wx.navigateBack();
  },

  onReachBottom: function () {},
});
