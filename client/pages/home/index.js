// pages/body-pix/index.js
const fetchWechat = require("fetch-wechat");
const tf = require("@tensorflow/tfjs-core");
const plugin = requirePlugin("tfjsPlugin");

import { Classifier } from "../../utils/body-pix";

Page({
  classifier: null,

  /**
   * Page initial data
   */
  data: {
    predicting: false,
    canvasWidth: 300,
    canvasHeight: 150,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    plugin.configPlugin({
      fetchFunc: fetchWechat.fetchFunc(),
      tf,
      canvas: wx.createOffscreenCanvas(),
      backendName: "wechat-webgl-" + Math.random(),
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // setTimeout(() => {
    //   this.ctx = wx.createCanvasContext(CANVAS_ID)
    // }, 500)

    this.initClassifier();

    // const context = wx.createCameraContext(this)
    // const listener = context.onCameraFrame((frame) => {
    //   this.executeClassify(frame)
    // })
    // listener.start()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    if (this.classifier && this.classifier.isReady()) {
      this.classifier.dispose();
    }
  },

  initClassifier() {
    this.showLoadingToast();

    const systemInfo = wx.getSystemInfoSync();

    this.classifier = new Classifier("front", {
      width: systemInfo.windowWidth,
      height: systemInfo.windowHeight,
    });

    this.classifier
      .load()
      .then(() => {
        wx.hideLoading();
        const query = wx.createSelectorQuery();
        query
          .select("#app-canvas")
          .fields({ node: true, size: true })
          .exec((r) => {
            const canvas = r[0].node;
            const ctx = canvas.getContext("2d");
            const dpr = 1;
            const width = 500;
            const height = 375;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            this.ctx = ctx;
            this.canvas = canvas;
            ctx.save();
            ctx.scale(dpr, dpr);
            const img = canvas.createImage();
            img.src =
              "https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2440056271,1661178868&fm=26&gp=0.jpg";

            img.onload = () => {
              console.log(img.width, img.height);
              ctx.drawImage(img, 0, 0, width * dpr, height * dpr);
              const imageData = ctx.getImageData(0, 0, width, height);
              this.imageData = imageData;
              const data = {
                width: imageData.width,
                height: imageData.height,
                data: new Uint8Array(imageData.data),
              };
              this.executeClassify(data);
            };
            ctx.restore();
          });
      })
      .catch((err) => {
        console.log(err);
        wx.showToast({
          title: "网络连接异常",
          icon: "none",
        });
      });
  },

  executeClassify: function (frame) {
    if (this.classifier && this.classifier.isReady() && !this.data.predicting) {
      this.setData(
        {
          predicting: true,
        },
        () => {
          this.classifier
            .detectBodySegmentation(frame)
            .then((segmentation) => {
              console.log(segmentation);
              const maskImageData = this.classifier.toMaskImageData(
                segmentation
              );
              console.log(maskImageData);
              const data = this.canvas.createImageData(
                maskImageData.data,
                maskImageData.width,
                maskImageData.height
              );
              console.log(data);
              this.ctx.putImageData(data, 0, 0);
            })
            .catch((err) => {
              console.log(err);
            });
        }
      );
    }
  },

  showLoadingToast: function () {
    wx.showLoading({
      title: "拼命加载模型",
    });
  },

  hideLoadingToast: function () {
    wx.hideLoading();
  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {
    if (this.classifier && this.classifier.isReady()) {
      this.classifier.dispose();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: "AI Pocket - 身体部位识别",
    };
  },
});
