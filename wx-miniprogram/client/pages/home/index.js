import homeModel from './model';

Page({
  onLoad: async function () {
    const res = await homeModel.login();
    wx.setStorageSync('openid', res.result.openid);
    wx.setStorageSync('userInfoId', res.result.userInfoId)
  },
  handleDraw() {
    wx.navigateTo({
      url: '/pages/draw/index',
    });
  },
  handleDicovery() {
    wx.switchTab({
      url: '/pages/discovery/index',
    });
  },
});
