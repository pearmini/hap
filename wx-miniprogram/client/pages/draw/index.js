import ph from '../../lib/painters-and-hackers.js';
import promisify from '../../utils/promisify';
import Classifier from '../../utils/body-pix';
import getCanvas from '../../utils/getCanvas';
import drawModel from './model';

const CAVANS_ID = 'app-canvas';
const chooseImage = promisify(wx.chooseImage);
const getImageInfo = promisify(wx.getImageInfo);
const canvasGetImageData = promisify(wx.canvasGetImageData);
const canvasPutImageData = promisify(wx.canvasPutImageData);
const canvasToTempFilePath = promisify(wx.canvasToTempFilePath);
const {windowWidth, windowHeight} = wx.getSystemInfoSync();
const saveImageToPhotosAlbum = promisify(wx.saveImageToPhotosAlbum);

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
    isHacker: false,
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
      const view = {
        width,
        height,
        imagePath: path,
      };
      imagePath && (await this.combine(this.data.self, view));
    }
  },

  handleChangeFilterType: function (e) {
    const {key} = e.detail;
    this.setData({
      selectedFilterType: key,
    });
  },

  handleUploadSelf: async function () {
    this.setData(
      {
        isDone: false,
        isHacker: false,
      },
      async () => {
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
          const {imagePath} = this.data.view;
          this.selfImageData = imageData;
          imagePath && (await this.combine(self, this.data.view));
        }, 1000);
      }
    );
  },

  handleSelectImage: function () {
    this.setData(
      {
        isDone: false,
        isHacker: false,
      },
      () => {
        wx.navigateTo({
          url: '/pages/pictures/index',
        });
      }
    );
  },

  handleSave: async function () {
    try {
      const {canvasWidth, canvasHeight} = this.data;
      const commonOptions = {
        x: 0,
        y: 0,
        width: canvasWidth,
        height: canvasHeight,
        destWidth: canvasWidth,
        destHeight: canvasHeight,
      };
      let options;
      if (this.data.isHacker) {
        const canvas = await getCanvas('#' + CAVANS_ID);
        options = {
          canvas,
        };
      } else {
        options = {
          canvasId: CAVANS_ID,
        };
      }
      const {tempFilePath} = await canvasToTempFilePath({
        ...options,
        ...commonOptions,
      });
      await saveImageToPhotosAlbum({
        filePath: tempFilePath,
      });
      wx.showToast({
        title: '保存成功',
      });
    } catch (e) {
      console.error(e);
      wx.showToast({
        title: '保存失败',
        icon: 'none',
      });
    }
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
            resolve({
              width,
              height,
              path,
            });
          });
        }
      );
    });
  },

  handleDraw: async function (e) {
    try {
      if (this.data.isDrawing || this.data.isCombining) return;
      this.setData({
        isDrawing: true,
      });
      const {index} = e.target.dataset;
      if (this.data.selectedFilterType === 0) {
        wx.showLoading({
          title: '等待时间较长～',
        });
        const {imageURL} = this.data.filters[
          this.data.selectedFilterType
        ].styles[index];
        const openid = wx.getStorageSync('openid');
        const {path} = await getImageInfo({
          src: imageURL,
        });
        const resultImagePath = await drawModel.styleTransfer(
          this.contentImagePath,
          path,
          openid
        );
        await this.drawImageToCanvas(resultImagePath, 'transer');
        wx.hideLoading();
        this.setData({
          isDrawing: false,
        });
      } else {
        const {name} = this.data.filters[this.data.selectedFilterType].styles[
          index
        ];
        await this.handleVisAnimation(name, this.contentImageData);
      }
    } catch (e) {
      console.error(e);
      wx.hideLoading();
      wx.showToast({
        title: '出了点问题~',
        icon: 'none',
      });
      this.setData({
        isDrawing: false,
      });
    }
  },

  handleVisAnimation: async function (name, contentImageData) {
    if (name !== 'Vector') {
      wx.showToast({
        title: '暂时不支持，敬请期待～',
        icon: 'none',
      });
      return;
    }
    this.setData(
      {
        isHacker: true,
      },
      async () => {
        const canvas = await getCanvas('#' + CAVANS_ID);
        const {pixelRatio} = wx.getSystemInfoSync();
        canvas.width = this.data.canvasWidth * pixelRatio;
        canvas.height = this.data.canvasHeight * pixelRatio;
        const ctx = canvas.getContext('2d');
        ctx.scale(pixelRatio, pixelRatio);
        const hacker = ph
          .hackers()
          .canvas(canvas)
          .size([this.data.canvasWidth, this.data.canvasHeight])
          .imageData(contentImageData)
          .style(name)
          .end(() => {
            this.setData({
              isDrawing: false,
              isDone: true,
            });
          });
        hacker.start();
      }
    );
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
      const {width, height} = self;
      this.setData(
        {
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

              const segmentation = await this.classifier.detectBodySegmentation(
                {
                  data: this.selfImageData.data,
                  width: this.selfImageData.width,
                  height: this.selfImageData.height,
                }
              );

              const contentImageData = this.classifier.toMaskImageData(
                segmentation,
                backgroundData
              );

              this.contentImageData = contentImageData;

              await canvasPutImageData({
                canvasId: CAVANS_ID,
                data: contentImageData.data,
                x: 0,
                y: 0,
                width: contentImageData.width,
                height: contentImageData.height,
              });

              const {tempFilePath} = await canvasToTempFilePath({
                x: 0,
                y: 0,
                width,
                height,
                destWidth: width,
                destHeight: height,
                canvasId: CAVANS_ID,
              });

              this.contentImagePath = tempFilePath;

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
    return {
      width: width | 0,
      height: height | 0,
      path,
    };
  },
});
