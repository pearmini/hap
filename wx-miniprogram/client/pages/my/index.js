import myModel from './model';

Page({
  data: {
    count: 0,
    views: [],
    arts: [],
    codes: [],
    likes: [],
    index: 0,
  },

  onLoad: async function (options) {
    const index = 0;
    const {views, arts, codes, count} = await this.loadData(index);
    this.setData({
      count,
      index: index + views.length,
      views,
      arts,
      codes,
      likes:[...views, ...arts, ...codes]
    });
  },

  onPullDownRefresh: async function () {
    const index = 0;
    const {views, arts, codes, count} = await this.loadData(index);
    this.setData({
      count,
      index: index + views.length,
      views,
      arts,
      codes,
      likes:[...views, ...arts, ...codes]
    });
  },

  onReachBottom: async function () {
    const {views, arts, codes} = await this.loadData(this.data.index);
    if (views.length === 0) {
      wx.showToast({
        title: '没有更多数据啦～',
        icon: 'none',
      });
    } else {
      this.setData({
        views: [...this.data.views, ...views],
        likes:[...this.data.views, , ...arts, ...codes, ...views],
        index: this.data.index + views.length,
      });
    }
  },

  loadData: async function (index = 0) {
    const openid = wx.getStorageSync('openid');
    const res = await myModel.getUserInfo(openid);
    const userInfo = res.data[0];
    const {views, arts, codes} = await myModel.getLikes(userInfo.likes, index);
    return {views, arts, codes, count: userInfo.likes.length};
  },

  handleClickCard: function(e){
    const {index} = e.currentTarget.dataset;
    const data = this.data.likes[index];
    const app = getApp();
    app.globalData.selectedItem = data;
    wx.navigateTo({
      url: '/pages/detail/index',
    });
  }
});
