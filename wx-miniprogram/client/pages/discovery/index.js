import discoveryModel from './model';

Page({
  data: {
    selectedType: -1,
    queryText: '',
    typeList: [
      {
        name: '景点',
        value: 0,
        imageURL: '/assets/images/view.png',
        count: 0,
      },
      {
        name: '画家',
        value: 1,
        imageURL: '/assets/images/art.png',
        count: 0,
      },
      {
        name: '骇客',
        value: 2,
        imageURL: '/assets/images/code.png',
        count: 0,
      },
    ],
    showSearchIcon: true,
    styles: {},
    pageHeight: 0,
    cardList: [
      {
        index: 0,
        data: [],
      },
      {
        index: 1,
        data: [],
      },
      {
        index: 2,
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

  onReady: async function () {
    const res = await discoveryModel.count();
    this.setData({
      typeList: this.data.typeList.map((d, index) => ({
        ...d,
        count: res[index],
      })),
    });
  },

  onUnload: function () {},

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
