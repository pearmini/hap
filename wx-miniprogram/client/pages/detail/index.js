import detailModel from './model';

const app = getApp();

Page({
  data: {
    article: {},
    isLike: false,
  },

  onLoad: async function (options) {
    try {
      wx.showLoading({
        title: '下载中...',
      });
      // 设置 title
      const selectedItem = app.globalData.selectedItem;
      const titles = ['景点', '画家', '骇客'];
      wx.setNavigationBarTitle({
        title: titles[selectedItem.type],
      });

      const md = await detailModel.get(selectedItem);
      const openid = wx.getStorageSync('openid');
      const isLike = await detailModel.getLike(
        selectedItem.type,
        selectedItem._id,
        openid
      );
      const article = app.towxml(md, 'markdown');

      // 更新解析数据
      this.setData({
        article,
        isLike,
      });
    } catch (e) {
      console.error(e);
      wx.showToast({
        title: '出了点问题',
        icon: 'none',
      });
    } finally {
      wx.hideLoading();
    }
  },

  handleLike: async function () {
    const {isLike} = this.data;
    const selectedItem = app.globalData.selectedItem;
    const userInfoId = wx.getStorageSync('userInfoId');
    await detailModel.setLike(
      selectedItem.type,
      selectedItem._id,
      userInfoId,
      !isLike
    );
    this.setData({
      isLike: !isLike,
    });
  },
});
