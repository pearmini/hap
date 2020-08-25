import ph from '../../lib/painters-and-hackers.js';
import promisify from '../../utils/promisify';
import Classifier from '../../utils/body-pix';
import UPNG from '../../lib/upng';

const CAVANS_ID = 'app-canvas';
const chooseImage = promisify(wx.chooseImage);
const getImageInfo = promisify(wx.getImageInfo);
const canvasGetImageData = promisify(wx.canvasGetImageData);
const canvasPutImageData = promisify(wx.canvasPutImageData);
const {
  windowWidth,
  windowHeight
} = wx.getSystemInfoSync();

const fetchWechat = require('fetch-wechat');
const tf = require('@tensorflow/tfjs-core');
const plugin = requirePlugin('tfjsPlugin');

const app = getApp();



Page({
  data: {
    canvasWidth: windowWidth,
    canvasHeight: windowWidth * 0.618,
    isDrawing: false,
    isDone: false,
    isCombining: false,
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
    filters: [{
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
    const {
      selectedViewImagePath
    } = app.globalData;
    if (selectedViewImagePath) {
      app.globalData.selectedViewImagePath = '';
      const {
        width,
        height,
        path
      } = await this.drawImageToCanvas(
        selectedViewImagePath,
        'view'
      );
      const {
        imagePath
      } = this.data.self;
      const view = {
        width,
        height,
        imagePath: path
      };
      imagePath && (await this.combine(this.data.self, view));
    }
  },

  handleChangeFilterType: function (e) {
    const {
      key
    } = e.detail;
    this.setData({
      selectedFilterType: key,
    });
  },

  handleUploadSelf: async function () {
    const {
      tempFilePaths
    } = await chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
    });
    const selectedSelfImagePath = tempFilePaths[0];
    const {
      width,
      height
    } = await this.drawImageToCanvas(
      selectedSelfImagePath,
      'self'
    );

    // 这里需要一点延迟在获得 ImageData
    setTimeout(async () => {
      const imageData = await canvasGetImageData({
        canvasId: CAVANS_ID,
        x: 0,
        y: 0,
        width: width,
        height: height,
      });
      const self = {
        ...this.data.self,
        imageData,
      };
      const {
        imagePath
      } = this.data.view;
      this.selfImageData = imageData;
      imagePath && (await this.combine(self, this.data.view));
    }, 1000);
  },

  handleSelectImage: function () {
    wx.navigateTo({
      url: '/pages/pictures/index',
    });
  },

  drawImageToCanvas: async function (imageURL, key) {
    const {
      width,
      height,
      path
    } = await this.getToDrawImageSize(imageURL);
    return new Promise((resolve, reject) => {
      this.setData({
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
            resolve({
              width,
              height,
              path
            });
          });
        }
      );
    });
  },

  handleDraw: async function (e) {
    try {
      if (this.data.isDrawing || this.data.isCombining) return;
      wx.showLoading({
        title: '绘制中',
      });
      const {
        index
      } = e.target.dataset;

      if (this.data.selectedFilterType === 0) {
        const {
          imageURL
        } = this.data.filters[
          this.data.selectedFilterType
        ].styles[index];
        await this.handleStyleTransfer(imageURL);
      } else {
        const {
          name
        } = this.data.filters[this.data.selectedFilterType].styles[
          index
        ];
        await this.handleVisAnimation(name);
      }
    } catch (e) {
      console.error(e);
    } finally {
      wx.hideLoading();
    }
  },

  handleStyleTransfer: async function (imageURL) {
    const {
      canvasWidth,
      canvasHeight
    } = this.data;
    let contentImageBase64, styleImageBase64;
    const contentImageData = await canvasGetImageData({
      canvasId: CAVANS_ID,
      x: 0,
      y: 0,
      width: canvasWidth | 0,
      height: canvasHeight | 0
    });

    const {
      width: styleImageCanvasWidth,
      height: styleImageCanvasHeight,
    } = await this.drawImageToCanvas(imageURL, 'style');

    const styleImageData = await canvasGetImageData({
      canvasId: CAVANS_ID,
      x: 0,
      y: 0,
      width: styleImageCanvasWidth | 0,
      height: styleImageCanvasHeight | 0
    });

    await this.styleTransfer(contentImageData, styleImageData);
    // const resultImageData = await styleTransfer(contentImageData, styleImageData);
  },

  styleTransfer: async function (contentImageData, styleImageData) {
    console.log(contentImageData, styleImageData);
    let pngData = UPNG.encode([contentImageData.data.buffer], contentImageData.width, contentImageData.height);
    let contentImageBase64 = "data:image/png;base64," + wx.arrayBufferToBase64(pngData);
    pngData = UPNG.encode([styleImageData.data.buffer], styleImageData.width, styleImageData.height);
    let styleImageBase64 = "data:image/png;base64," + wx.arrayBufferToBase64(pngData);
    return new Promise((resolve, reject) => {
      wx.request({
        url: 'https://api.deepai.org/api/fast-style-transfer',
        data: {
          content: contentImageBase64,
          style: styleImageBase64
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'api-key': '5159143e-01f9-4975-ae0b-b0c376ef1c64'
        },
        method: "POST",
        success: function (res) {
          resolve(res.data);
        },
        fail: function (err) {
          reject(err)
        }
      })
    })
  },

  handleVisAnimation: async function (name) {
    console.log(name);

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
    try {
      if (!this.classifier.ready) {
        wx.showLoading({
          title: '合并中...',
        });
        this.shouldCombine = true;
        return;
      }

      wx.showLoading({
        title: '合并中...',
      });
      this.setData({
        isCombining: true,
      });
      const {
        width,
        height
      } = self;
      this.setData({
          canvasWidth: width,
          canvasHeight: height,
        },
        () => {
          // 需要设置一点延迟否者获得的 ImageData 有问题
          setTimeout(async () => {
            const ctx = wx.createCanvasContext(CAVANS_ID);
            ctx.drawImage(view.imagePath, 0, 0, width, height);
            ctx.draw(true, async () => {
              const backgroundData = await canvasGetImageData({
                canvasId: CAVANS_ID,
                x: 0,
                y: 0,
                width: width | 0,
                height: height | 0,
              });

              const segmentation = await this.classifier.detectBodySegmentation({
                data: this.selfImageData.data,
                width: this.selfImageData.width,
                height: this.selfImageData.height,
              });

              const maskImageData = this.classifier.toMaskImageData(
                segmentation,
                backgroundData
              );

              await canvasPutImageData({
                canvasId: CAVANS_ID,
                data: maskImageData.data,
                x: 0,
                y: 0,
                width: maskImageData.width,
                height: maskImageData.height,
              });

              wx.hideLoading();
              this.setData({
                isCombining: false,
              });
            });
          }, 1000);
        }
      );
    } catch (e) {
      console.error(e);
      wx.hideLoading();
      wx.showToast({
        title: '出现了一点问题～',
        icon: 'none',
      });
      this.setData({
        isCombining: false,
      });
    }
  },

  getToDrawImageSize: async function (imageURL) {
    const {
      width: imageWidth,
      height: imageHeight,
      path
    } = await getImageInfo({
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
    return {
      width: width | 0,
      height: height | 0,
      path
    };
  },
});
