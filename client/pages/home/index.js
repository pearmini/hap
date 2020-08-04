import Brush from '../../utils/brush/index';

Page({
  data: {
    canvasHeight: 0,
    canvasWidth: 0,
    isDrawing: false,
  },

  onLoad: function () {
    this.brush = new Brush();
  },

  onReady: function () {
    const query = wx.createSelectorQuery();
    query
      .select('#app-canvas')
      .fields({node: true, size: true})
      .exec((res) => {
        const canvas = res[0].node;
        const img = canvas.createImage();
        img.src = '../../assets/images/example.png';
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
          ctx.scale(pixelRatio, pixelRatio);
          ctx.drawImage(img, 0, 0, width, height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          this.brush.setup({
            imageData,
            width,
            height,
            ctx,
            method: 'array',
          });

          this.setData({
            canvasWidth: width,
            canvasHeight: height,
          });
        };
      });
  },

  handleDraw: function () {
    if (!this.data.isDrawing) {
      this.brush.draw(() => {
        this.setData({
          isDrawing: false,
        });
      });

      this.setData({
        isDrawing: true,
      });
    }
  },
});
