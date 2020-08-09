import ph from '../../utils/painters-and-hackers/index';

Page({
  data: {
    canvasHeight: 0,
    canvasWidth: 0,
    isDrawing: false,
  },

  onLoad: function () {},

  onReady: function () {
    // 绘制图片
    const query = wx.createSelectorQuery();
    query
      .select('#app-canvas')
      .fields({node: true, size: true})
      .exec((res) => {
        const canvas = res[0].node;
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
          console.log(img);
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
    const query = wx.createSelectorQuery();
    query
      .select('#app-canvas')
      .fields({node: true, size: true})
      .exec((res) => {
        const canvas = res[0].node;
        const ctx = canvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const hacker = ph
          .hacker()
          .canvas(canvas)
          .size([canvas.width, canvas.height])
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
