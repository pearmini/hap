import ph from '../../lib/painters-and-hackers.js';
import promisify from '../../utils/promisify';
import Classifier from '../../utils/body-pix';

const CAVANS_ID = 'app-canvas';
const chooseImage = promisify(wx.chooseImage);
const getImageInfo = promisify(wx.getImageInfo);
const canvasGetImageData = promisify(wx.canvasGetImageData);
const canvasToTempFilePath = promisify(wx.canvasToTempFilePath);
const {windowWidth, windowHeight} = wx.getSystemInfoSync();

const fetchWechat = require('fetch-wechat');
const tf = require('@tensorflow/tfjs-core');
const plugin = requirePlugin('tfjsPlugin');

const app = getApp();

Page({
  data: {
    canvasWidth: windowWidth,
    canvasHeight: windowWidth * 0.618,
    isDrawing: false,
    self: {
      imagePath: '',
      width: 0,
      height: 0,
    },
    view: {
      imagePath: '',
      width: 0,
      height: 0,
    },
    filters: [
      {
        name: '画家',
        labels: ph.painters().labels(),
        styles: ph.painters().styles(),
      },
      {
        name: '骇客',
        labels: ph.hackers().labels(),
        styles: ph.hackers().styles(),
      },
    ],
    filterNames: ['画家', '骇客'],
    selectedFilterType: 0,
  },

  onLoad: function () {
    this.shouldCombine = false;
    plugin.configPlugin({
      fetchFunc: fetchWechat.fetchFunc(),
      tf,
      canvas: wx.createOffscreenCanvas(),
      backendName: 'wechat-webgl-' + Math.random(),
    });

    // 绘制画布
    const ctx = wx.createCanvasContext(CAVANS_ID);
    ctx.setFillStyle('#ECECEC');
    ctx.fillRect(0, 0, this.data.canvasWidth, this.data.canvasHeight);
    ctx.draw();
  },

  onReady: async function () {
    this.classifier = new Classifier();
    await this.classifier.load();
    if (this.shouldCombine) {
      this.combine(this.self, this.view);
      wx.hideLoading();
    }
  },

  onUnLoad: function () {
    this.classifier.dispose();
  },

  onShow: async function () {
    const {selectedViewImagePath} = app.globalData;
    if (selectedViewImagePath) {
      app.globalData.selectedViewImagePath = '';
      const {width, height, path} = await this.drawImageToCanvas(
        selectedViewImagePath,
        'view'
      );
      const {imagePath} = this.data.self;
      const view = {width, height, imagePath: path};
      imagePath && this.combine(this.data.self, view);
    }
  },

  handleUploadSelf: async function () {
    const {tempFilePaths} = await chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
    });
    const selectedSelfImagePath = tempFilePaths[0];
    const {width, height} = await this.drawImageToCanvas(
      selectedSelfImagePath,
      'self'
    );

    const imageData = await canvasGetImageData({
      canvasId: CAVANS_ID,
      x: 0,
      y: 0,
      width,
      height,
    });
    const self = {
      ...this.data.self,
      imageData,
    };
    const {imagePath} = this.data.view;
    imagePath && this.combine(self, this.data.view);
    this.selfImagedata = imageData;
  },

  handleSelectImage: function () {
    wx.navigateTo({
      url: '/pages/pictures/index',
    });
  },

  drawImageToCanvas: async function (imageURL, key) {
    const {width, height, path} = await this.getToDrawImageSize(imageURL);
    return new Promise((resolve, reject) => {
      this.setData(
        {
          canvasWidth: width,
          canvasHeight: height,
          [key]: {
            ...this.data[key],
            imagePath: path,
            width,
            height,
          },
        },
        () => {
          const ctx = wx.createCanvasContext(CAVANS_ID);
          ctx.drawImage(path, 0, 0, width, height);
          ctx.draw(true, () => {
            resolve({width, height, path});
          });
        }
      );
    });
  },

  handleDraw: async function (e) {
    const {index} = e.target.dataset;
    console.log(index);
    const imageData = await canvasGetImageData({
      canvasId: CAVANS_ID,
      x: 0,
      y: 0,
      width,
      height,
    });

    // 将 canvas 变成图片上传到服务器
    // const {tempFilePath} = await canvasToTempFilePath({
    //   canvasId: CAVANS_ID,
    //   x: 0,
    //   y: 0,
    //   width: this.data.canvasWidth,
    //   height: this.data.canvasHeight,
    // });

    // const {imageURL} = this.data.filters[this.data.selectedFilterType].styles[
    //   index
    // ];
    // const params = {
    //   content: tempFilePath,
    //   style: imageURL,
    // };
    // wx.request({
    //   url: 'https://api.deepai.org/api/fast-style-transfer',
    //   data: params,
    //   header: {
    //     'content-type': 'application/x-www-form-urlencoded', //修改此处即可
    //     'Api-Key': '79c92106-c2e4-4c9e-8835-585ffb6eba46',
    //   },
    //   success(res) {
    //     console.log(res.data);
    //   },
    //   error: console.error,
    // });

    // console.log(tempFilePath);

    // if (this.data.selectedFilterType === 0) {
    //   const {imageURL} = this.data.filters[this.data.selectedFilterType].styles[
    //     index
    //   ];
    //   console.log(filter);
    // }
    // if (this.data.isDrawing) return;
    // const imageData = await canvasGetImageData({
    //   canvasId: CAVANS_ID,
    //   x: 0,
    //   y: 0,
    //   width: this.data.canvasWidth,
    //   height: this.data.canvasHeight,
    // });
    // const canvas = await getCanvas('#app-canvas');
    // const {pixelRatio} = wx.getSystemInfoSync();
    // canvas.width = this.data.canvasWidth * pixelRatio;
    // canvas.height = this.data.canvasHeight * pixelRatio;
    // const ctx = canvas.getContext('2d');
    // ctx.scale(pixelRatio, pixelRatio);
    // const hacker = ph
    //   .hackers()
    //   .canvas(canvas)
    //   .size([this.data.canvasWidth, this.data.canvasHeight])
    //   .imageData(imageData)
    //   .style('vector')
    //   .end(() => {
    //     this.setData({
    //       isDrawing: false,
    //     });
    //   });

    // hacker.start();
    // this.setData({
    //   isDrawing: true,
    // });
  },

  combine: async function (self, view) {
    if (!this.classifier.ready) {
      wx.showLoading({
        title: '分割中...',
      });
      this.shouldCombine = true;
      return;
    }

    wx.showLoading({
      title: '合并中...',
    });
    const {width, height} = self;
    this.setData(
      {
        canvasWidth: width,
        canvasHeight: height,
      },
      () => {
        const ctx = wx.createCanvasContext(CAVANS_ID);
        ctx.drawImage(view.imagePath, 0, 0, width, height);
        ctx.draw(true, async () => {
          const backgroundData = await canvasGetImageData({
            canvasId: CAVANS_ID,
            x: 0,
            y: 0,
            width,
            height,
          });

          const segmentation = await this.classifier.detectBodySegmentation({
            data: this.selfImagedata.data,
            width: this.selfImagedata.width,
            height: this.selfImagedata.height,
          });

          const maskImageData = this.classifier.toMaskImageData(
            segmentation,
            backgroundData
          );

          wx.canvasPutImageData({
            canvasId: CAVANS_ID,
            data: maskImageData.data,
            x: 0,
            y: 0,
            width: maskImageData.width,
            height: maskImageData.height,
          });
          wx.hideLoading();
        });
      }
    );
  },

  getToDrawImageSize: async function (imageURL) {
    const {width: imageWidth, height: imageHeight, path} = await getImageInfo({
      src: imageURL,
    });
    let width, height;
    const ratio = imageHeight / imageWidth;
    if (ratio > 1) {
      height = Math.min(windowHeight * 0.65, imageHeight);
      width = (height / ratio) | 0;
    } else {
      width = windowWidth;
      height = (width * ratio) | 0;
    }
    return {width, height, path};
  },
});
