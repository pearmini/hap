Page({
  handleDraw(){
    wx.navigateTo({
      url: '/pages/draw/index',
    })
  },
  handleDicovery(){
    wx.switchTab({
      url: '/pages/discovery/index',
    })
  }
});
