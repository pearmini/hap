// miniprogram/pages/draw/draw.js
import { GoodsModel } from '../../models/goods.js'
const goodsModel = new GoodsModel();
Page({

  data: {
    selectedImg: null,
    selectedStroke: null,
    selectedSample: null,
    defaultUrl: "../../images/2.png",
    height: 0,
    defaultShareImageUrl: 'https://7765-wechatcloud-79m2p-1259642785.tcb.qcloud.la/assets/wxfa468967fadbc4a5.o6zAJs_1ObMKghQped4qZRpgJbbw.2Ayw0fSIVmXHda444a3387f72b78cb32ebd4d91b8c36.png?sign=723b2b23be1518348048a8d465b0ab00&t=1565831746'
  },

  onLoad: function(options) {

    wx.getSystemInfo({
      success: res => {
        const { windowWidth, windowHeight } = res;
        const height = 375 / windowWidth * windowHeight * 2;
        this.setData({
          height
        })
      }
    })
  },

  onShow() {
    const msg = wx.getStorageSync('error');
    wx.removeStorageSync('error');
    if (msg) {
      wx.lin.showMessage({
        content: '获取图片失败，换一张吧～',
        type: "error"
      })
    }
  },

  onSelect: function(e) {
    const type = e.target.dataset.type;
    wx.navigateTo({
      url: `../discover/discover?type=${type}`
    })
  },


  draw: function(e) {
    if (this.data.selectedImg === null) {
      wx.lin.showMessage({
        content: '请选择一张图片',
        type: "error"
      })
      return
    } else if (this.data.selectedStroke === null) {
      wx.lin.showMessage({
        content: '请选择一种绘画风格',
        type: "error"
      })
      return
    } else if (this.data.selectedSample === null) {
      wx.lin.showMessage({
        content: '请选择一种绘制手段',
        type: "error"
      })
      return
    }

    wx.setStorageSync('data', {
      img: this.data.selectedImg,
      stroke: this.data.selectedStroke,
      sample: this.data.selectedSample
    })

    wx.navigateTo({
      url: `../brush/brush`
    })
  },
  onShareAppMessage(e) {
    if (e.from === 'button') {
      const path = e.target.dataset.path;
      console.log(path);
      return {
        title: '快来涂鸦上海吧！',
        imageUrl: path
      }
    } else {
      return {
        title: '快来涂鸦上海吧！',
        imageUrl: this.data.defaultShareImageUrl
      }
    }
  }
})