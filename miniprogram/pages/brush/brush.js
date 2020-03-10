import { B2 } from "../../util/b2/index.js";
import { formatTime, formatNumber } from "../../util/util.js";
import { ArtworksModel } from "../../models/artworks.js";
import { FileModel } from "../../models/files.js";
const artworksModel = new ArtworksModel();
const fileModel = new FileModel();
Page({
  data: {
    isDone: false,
    isRunning: false,
    canvasWidth: "",
    canvasHeight: "",
    b2: null,
    loading: true,
    style: "",
    rotate: false,
    img: null,
    stroke: null,
    sample: null,
    success: false
  },

  onLoad: function(options) {
    //从缓存中获取传递过来的数据
    const data = wx.getStorageSync("data");
    wx.removeStorageSync("data");
    this.data.sample = data.sample;
    this.data.stroke = data.stroke;
    this.data.img = data.img;

    // 初始化画笔
    fileModel
      .get(this.data.img.fileid)
      .then(
        res => {
          this.data.b2 = new B2(
            "canvas",
            this.data.sample.name,
            this.data.stroke.name,
            res.tempFilePath
          );
          return this.data.b2.getCanvasInfo(); //获得上下文信息
        },
        error => {
          wx.setStorageSync("error", "获取数据失败!");
          wx.navigateBack();
        }
      )
      .then(res => {
        // 更新页面数据
        const { canvasWidth, canvasHeight, rotate } = res;
        return new Promise((resolve, reject) => {
          this.setData(
            {
              canvasWidth,
              canvasHeight,
              rotate
            },
            res => {
              resolve(res);
            }
          );
        });
      })
      .then(res => {
        //画图
        return this.data.b2.drawImage();
      })
      .then(res => {
        //显示按钮
        this.setData({
          loading: false
        });
      });
  },

  start(e) {
    this.setData({
      isRunning: true
    });
    wx.showLoading({
      title: "准备中～"
    });

    this.data.b2
      .loadingImageData()
      .then(res => {
        wx.hideLoading();
        return this.data.b2.run();
      })
      .then(res => {
        this.setData({
          isDone: true
        });
      });
  },

  onSaveImage(e) {
    wx.showLoading({
      title: "正在保存"
    });
    this.data.b2
      .getTempFilePath()
      .then(res => {
        return fileModel.add(res.tempFilePath, this.getFileName());
      })
      .then(res => {
        const time = new Date().getTime();
        return artworksModel.add(
          res.fileID,
          this.data.rotate,
          {
            img: [this.data.img.name, this.data.img._id],
            stroke: [this.data.stroke.name, this.data.stroke._id],
            sample: [this.data.sample.name, this.data.sample._id]
          },
          time
        );
      })
      .then(res => {
        wx.hideLoading();
        this.setData({
          success: true
        });
      });
  },

  getFileName() {
    const date = new Date();
    const name = formatTime(date);
    return `userimg/${name}.png`;
  },

  onCancel(e) {
    wx.navigateBack({
      delta: 1
    });
  }
});
