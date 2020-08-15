import ph from '../../lib/painters-and-hackers.js';
import getCanvas from '../../utils/getCanvas';
import promisify from '../../utils/promisify';

const CAVANS_ID = 'app-canvas';
const chooseImage = promisify(wx.chooseImage);
const getImageInfo = promisify(wx.getImageInfo);
const canvasGetImageData = promisify(wx.canvasGetImageData);
const {windowWidth, windowHeight} = wx.getSystemInfoSync();

Page({
  data: {
    canvasWidth: windowWidth,
    canvasHeight: windowWidth / 2,
    hide: false,
    isDrawing: false,
  },

  onLoad:function(){
    const ctx = wx.createCanvasContext(CAVANS_ID);
    ctx.setFillStyle("#ECECEC")
    ctx.fillRect(0, 0,this.data.canvasWidth, this.data.canvasHeight);
    ctx.draw();
  },

  handleSelectImage: function () {
    wx.navigateTo({
      url: '/pages/pictures/index',
    });
  },

  handleUploadSelf: async function () {
    const {tempFilePaths} = await chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
    });
    const imageURL = tempFilePaths[0];
    const {width: imageWidth, height: imageHeight, path} = await getImageInfo({
      src: imageURL,
    });
    let width, height;
    const ratio = imageHeight / imageWidth;
    if (ratio > 1) {
      height = Math.min(windowWidth, windowHeight - 210);
      width = (height / ratio) | 0;
    } else {
      width = windowWidth;
      height = (width * ratio) | 0;
    }
    const ctx = wx.createCanvasContext(CAVANS_ID);
    ctx.drawImage(path, 0, 0, width, height);
    ctx.draw();

    this.setData({
      canvasWidth: width,
      canvasHeight: height,
      hide: true,
    });
  },

  handleDraw: async function () {
    if (this.data.isDrawing) return;
    const imageData = await canvasGetImageData({
      canvasId: CAVANS_ID,
      x: 0,
      y: 0,
      width: this.data.canvasWidth,
      height: this.data.canvasHeight,
    });

    const canvas = await getCanvas('#app-canvas');
    const {pixelRatio} = wx.getSystemInfoSync();
    canvas.width = this.data.canvasWidth * pixelRatio;
    canvas.height = this.data.canvasHeight * pixelRatio;
    const ctx = canvas.getContext('2d');
    ctx.scale(pixelRatio, pixelRatio);
    const hacker = ph
      .hackers()
      .canvas(canvas)
      .size([this.data.canvasWidth, this.data.canvasHeight])
      .imageData(imageData)
      .style('vector')
      .end(() => {
        this.setData({
          isDrawing: false,
        });
      });

    hacker.start();

    this.setData({
      isDrawing: true,
    });
  },
});
