import discoveryModel from './model';

Page({
  data: {
    selectedType: -1,
    queryText: '',
    typeList: [
      {
        name: '景点',
        value: 0,
        imageURL:
          'https://7765-wechatcloud-79m2p-1259642785.tcb.qcloud.la/app/view.png?sign=2911bb9f9c296cea4394833a0e65342d&t=1597499275',
      },
      {
        name: '画家',
        value: 1,
        imageURL:
          'https://7765-wechatcloud-79m2p-1259642785.tcb.qcloud.la/app/art.png?sign=f3363efeaa1f6d0f45155844c6e3926e&t=1597499237',
      },
      {
        name: '骇客',
        value: 2,
        imageURL:
          'https://7765-wechatcloud-79m2p-1259642785.tcb.qcloud.la/app/code.png?sign=86e4dbdc588c19a10d0cb5696d53590a&t=1597499261',
      },
    ],
    showSearchIcon: true,
    pageHeight: 0,
    cardList: [
      {
        index: 0,
        data: [],
        labels: [],
      },
      {
        index: 0,
        data: [],
        labels: [],
      },
      {
        index: 0,
        data: [],
        labels: [],
      },
    ],
    isFocus: false,
    queryText: '',
    queryLabel: '',
    isLoading: false,
  },

  onLoad: async function (options) {
    const {windowHeight} = wx.getSystemInfoSync();
    this.scrollDistance = [0, 0, 0];
    this.setData({
      pageHeight: windowHeight,
    });
  },

  onReachBottom: async function () {
    try {
      wx.showLoading({
        title: '加载中',
      });
      this.setData({
        isLoading: true,
      });
      const {selectedType, cardList, queryText, queryLabel} = this.data;
      const oldType = cardList[selectedType];
      const index = oldType.index;
      const {data} = await discoveryModel.get(
        selectedType,
        index,
        queryText,
        queryLabel
      );

      if (data.length === 0) {
        wx.showToast({
          title: '没有更多了～',
          icon: 'none',
        });
      } else {
        oldType.data = [...oldType.data, ...data];
        oldType.index += data.length;
        this.setData({
          cardList,
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      wx.hideLoading();
      this.setData({
        isLoading: false,
      });
    }
  },

  onPageScroll: function (e) {
    this.scrollDistance[this.data.selectedType] = e.scrollTop;
  },

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
    try {
      const {type} = e.target.dataset;
      this.setData({
        selectedType: type,
      });

      wx.pageScrollTo({
        scrollTop: this.scrollDistance[this.data.selectedType],
      });

      // 如果有数据就不获取
      const {cardList} = this.data;
      const oldType = cardList[type];
      if (oldType.data.length !== 0) return;

      // 否者就获取
      this.setData({
        isLoading: true,
      });
      wx.showLoading({
        title: '加载中...',
      });
      const {data} = await discoveryModel.get(type);
      const {result: labels} = await discoveryModel.getLabels(type);
      oldType.data = [...oldType.data, ...data];
      oldType.index += data.length;
      oldType.labels = labels;
      this.setData({
        cardList,
      });
    } catch (e) {
      console.error(e);
    } finally {
      wx.hideLoading();
      this.setData({
        isLoading: false,
      });
    }
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

  handleFocus: function () {
    this.setData({
      isFocus: true,
    });
  },

  handleBlur: function () {
    this.setData({
      isFocus: false,
    });
  },

  handleConfirm: async function (e) {
    try {
      const {value} = e.detail;
      if (value === '') {
        wx.showToast({
          title: '不能为空',
          icon: 'none',
        });
        return;
      }

      wx.showLoading({
        title: '查询中...',
      });

      const {selectedType, cardList, queryLabel} = this.data;
      const oldType = cardList[selectedType];
      const {data} = await discoveryModel.get(
        selectedType,
        0,
        value,
        queryLabel
      );
      oldType.data = data;
      oldType.index += data.length;
      this.setData({
        cardList,
        queryText: value,
      });
    } catch (e) {
      console.error(e);
    } finally {
      wx.hideLoading();
      this.setData({
        isLoading: false,
      });
    }
  },

  handleClear: async function () {
    try {
      wx.showLoading();
      const {selectedType, cardList, queryLabel} = this.data;
      const oldType = cardList[selectedType];
      const {data} = await discoveryModel.get(selectedType, 0, '', queryLabel);
      oldType.data = data;
      oldType.index += data.length;
      this.setData({
        cardList,
        queryText: '',
      });
    } catch (e) {
      console.error(e);
    } finally {
      wx.hideLoading();
    }
  },

  handleClickLabel: async function (e) {
    try {
      const {label} = e.target.dataset;

      // 取消选择该 label
      if (this.data.queryLabel === label) {
        this.setData({
          queryLabel: '',
        });
        return;
      }

      wx.showLoading({
        title: '查询中...',
      });

      const {selectedType, cardList, queryText} = this.data;
      const oldType = cardList[selectedType];
      const {data} = await discoveryModel.get(
        selectedType,
        0,
        queryText,
        label
      );
      oldType.data = data;
      oldType.index += data.length;
      this.setData({
        cardList,
        queryLabel: label,
      });
    } catch (e) {
      console.error(e);
    } finally {
      wx.hideLoading();
    }
  },
});
