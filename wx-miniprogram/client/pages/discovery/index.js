import discoveryModel from './model';

Page({
  data: {
    selectedType: -1,
    queryText: '',
    typeList: [
      {
        name: '景点',
        value: 0,
        imageURL: 'https://7765-wechatcloud-79m2p-1259642785.tcb.qcloud.la/app/view.png?sign=2911bb9f9c296cea4394833a0e65342d&t=1597499275',
      },
      {
        name: '画家',
        value: 1,
        imageURL: 'https://7765-wechatcloud-79m2p-1259642785.tcb.qcloud.la/app/art.png?sign=f3363efeaa1f6d0f45155844c6e3926e&t=1597499237',
      },
      {
        name: '骇客',
        value: 2,
        imageURL: 'https://7765-wechatcloud-79m2p-1259642785.tcb.qcloud.la/app/code.png?sign=86e4dbdc588c19a10d0cb5696d53590a&t=1597499261',
      },
    ],
    showSearchIcon: true,
    pageHeight: 0,
    cardList: [
      {
        index: 0,
        data: [],
      },
      {
        index: 0,
        data: [],
      },
      {
        index: 0,
        data: [],
      },
    ],
  },

  onLoad: function (options) {
    const {windowHeight} = wx.getSystemInfoSync();
    this.setData({
      pageHeight: windowHeight,
    });
  },

  onPullDownRefresh: function () {},

  onReachBottom: function () {},

  handleFocus: function () {
    this.setData({
      showSearchIcon: false,
    });
  },

  handleBlur: function () {
    this.setData({
      showSearchIcon: true,
    });
  },

  handleSelectType: async function (e) {
    const {type} = e.target.dataset;
    this.setData({
      selectedType: type,
    });

    const newCardList = this.data.cardList;
    const oldType = newCardList[type];
    if (oldType.data.length !== 0) return;
    const {data} = await discoveryModel.get(type);
    oldType.data = [...oldType.data, ...data];
    oldType.index += data.length;
    this.setData({
      cardList: newCardList,
    });
  },

  handleClickBody: function () {
    this.setData({
      selectedType: -1,
    });
  },

  handleClickCard: function (e) {
    const {index} = e.currentTarget.dataset;
    const data = this.data.cardList[this.data.selectedType].data[index];
    const app = getApp();
    app.globalData.selectedItem = data;
    wx.navigateTo({
      url: '/pages/detail/index',
    });
  },
});
