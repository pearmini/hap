import detailModel from "./model"

Page({
  data: {
    article: {},
  },

  onLoad: async function (options) {
    // 设置 title
    const app = getApp();
    const selectedItem = app.globalData.selectedItem;
    const titles = ['景点', '画家', '骇客'];
    wx.setNavigationBarTitle({
      title: titles[selectedItem.type],
    });

    const md = await detailModel.get(selectedItem);
    const article = app.towxml(md, 'markdown');

    // 更新解析数据
    this.setData({
      article,
    });
  },

  onPullDownRefresh: function () {},
});
