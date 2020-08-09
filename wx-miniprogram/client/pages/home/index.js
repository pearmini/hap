import ph from '../../lib/painters-and-hackers.js';
import getCanvas from '../../utils/getCanvas';

Page({
  data: {
    canvasHeight: 0,
    canvasWidth: 0,
    isDrawing: false,
  },

  onLoad: function () {},

  onReady: function () {
    // 绘制图片
    getCanvas('#app-canvas', (canvas) => {
      const img = canvas.createImage();
      img.src = '/assets/images/example.png';
      img.onload = () => {
        const {windowWidth, pixelRatio} = wx.getSystemInfoSync();
        let width, height;
        const ratio = img.height / img.width;
        if (ratio > 1) {
          height = windowWidth;
          width = height / ratio;
        } else {
          width = windowWidth;
          height = width * ratio;
        }
        canvas.width = width * pixelRatio;
        canvas.height = height * pixelRatio;
        const ctx = canvas.getContext('2d');
        ctx.save();
        ctx.scale(pixelRatio, pixelRatio);
        ctx.drawImage(img, 0, 0, width, height);
        ctx.restore();

        this.setData({
          canvasWidth: width,
          canvasHeight: height,
        });
      };
    });
  },

  handleDraw: function () {
    if (this.data.isDrawing) return;
    getCanvas('#app-canvas', (canvas) => {
      const {pixelRatio} = wx.getSystemInfoSync();
      const ctx = canvas.getContext('2d');
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const hacker = ph
        .hacker()
        .canvas(canvas)
        .size([canvas.width / pixelRatio, canvas.height / pixelRatio])
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
    });
  },
});
