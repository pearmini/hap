import { strokerManager } from "./strokers/index.js";
import { samplerManager } from "./samplers/index.js";
import { promisic } from "../util.js";

class B2 {
  constructor(canvasId, sample, stroke, url) {
    this.canvasId = canvasId;
    this.ctx = wx.createCanvasContext(canvasId);
    this.sampler = samplerManager.get(sample);
    this.stroker = strokerManager.get(stroke);
    this.url = url;
    this.frameCount = 0;
  }

  getCanvasInfo() {
    return promisic(wx.getImageInfo)({ src: this.url }).then(res => {
      [this.width, this.height, this.ratio] = this.getContextSize(
        res.width,
        res.height
      );
      this.path = res.path;
      if (res.width > res.height) {
        this.rotate = true;
      } else {
        this.rotate = false;
      }
      return this.sendCanvasInfoBack();
    }, console.log);
  }

  sendCanvasInfoBack() {
    return new Promise((resolve, reject) => {
      // 转换成rpx
      const canvasWidth = this.width * this.ratio;
      const canvasHeight = this.height * this.ratio;
      const rotate = this.rotate;
      resolve({ canvasWidth, canvasHeight, rotate });
    });
  }

  loadingImageData() {
    return promisic(wx.canvasGetImageData)({
      canvasId: this.canvasId,
      x: 0,
      y: 0,
      width: this.width,
      height: this.height
    }).then(res => {
      this.pixelsData = res.data;
      return new Promise((resolve, reject) => {
        resolve();
      });
    });
  }

  drawImage() {
    let width = this.width,
      height = this.height;
    this.ctx.save();
    if (this.rotate) {
      this.ctx.translate(this.width, 0);
      this.ctx.rotate((90 * Math.PI) / 180);
      width = this.height;
      height = this.width;
    }
    this.ctx.drawImage(this.path, 0, 0, width, height);
    this.ctx.restore();
    return new Promise((resolve, reject) => {
      this.ctx.draw(false, res => {
        resolve(res);
      });
    });
  }

  getContextSize(width, height) {
    const res = wx.getSystemInfoSync();
    const { windowWidth, windowHeight } = res;
    const ratio = (375 / windowWidth) * 2;
    const imgRatio = width > height ? width / height : height / width;
    const screenRtio = windowHeight / windowWidth;
    const scale = 0.95;
    let canvasHeight, canvasWidth;
    if (imgRatio > screenRtio) {
      canvasHeight = windowHeight * scale;
      canvasWidth = canvasHeight / imgRatio;
    } else {
      canvasWidth = windowWidth * scale;
      canvasHeight = canvasWidth * imgRatio;
    }
    // 都转换成整数
    // 这里太坑人了！！！
    return [Math.floor(canvasWidth), Math.floor(canvasHeight), ratio];
  }

  run() {
    this.setup();
    // 设置一些全局的需要传入的参数
    this.global = {
      color: {
        seed: Math.random(),
        first: true,
        width: this.width,
        height: this.height
      },
      arc: {
        first: true,
        width: this.width,
        height: this.height
      }
    };
    return this.draw();
  }

  setup() {
    // 取样器获得点，以及确定一帧绘制的点的数量
    const { data, sampleRate } = this.sampler(
      this.width,
      this.height,
      this.pixelsData,
      2 / this.ratio
    );
    this.data = data;
    this.sampleRate = sampleRate;
    this.maxFrameCount = Math.ceil(this.data.length / this.sampleRate);

    // 清空屏幕
    const mainColor = this.getMainColor();
    this.ctx.fillStyle = mainColor;
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.ctx.draw();
  }

  draw() {
    return new Promise((resolve, reject) => {
      this.timer = setInterval(() => {
        this.loop();
        if (this.data.length <= 0) {
          this.stop();
          resolve();
        }
      }, 30);
    });
  }

  loop() {
    let i = 0;
    this.frameCount++;
    while (this.data.length > 0 && i < this.sampleRate) {
      i++;
      const d = this.data.pop();
      const progress = this.frameCount / this.maxFrameCount;
      this.stroker(this.ctx, d, progress, this.global);
    }
    this.ctx.draw(true);
  }

  stop() {
    clearInterval(this.timer);
  }

  // 获得图片的主要颜色，确定绘制图片后的背景
  getMainColor() {
    const dist = (a, b) => {
      return Math.sqrt(
        (a.r - b.r) * (a.r - b.r),
        (a.g - b.g) * (a.g - b.g),
        (a.b - b.b) * (a.b - b.b),
        (a.a - b.a) * (a.a - b.a)
      );
    };
    const total = this.width * this.height;
    const set = [];
    const thres = 10;
    for (let i = 0; i < total; i++) {
      const d = {
        r: this.pixelsData[i * 4],
        g: this.pixelsData[i * 4 + 1],
        b: this.pixelsData[i * 4 + 2],
        a: this.pixelsData[i * 4 + 3]
      };
      let min = 1000,
        index = 0;
      for (let i = 0; i < set.length; i++) {
        const s = set[i];
        const dis = dist(s[0], d);
        if (dis < min) {
          (min = dis), (index = i);
        }
      }
      if (min < thres) {
        set[index].push(d);
      } else {
        set.push([d]);
      }
    }

    let result,
      max = 0;
    for (let s of set) {
      if (s.length > max) {
        (result = s[0]), (max = s.length);
      }
    }
    return `rgb(${result.r},${result.g},${result.b})`;
  }

  getTempFilePath() {
    return promisic(wx.canvasToTempFilePath)({
      x: 0,
      y: 0,
      width: this.width,
      height: this.height,
      destWidth: this.width,
      destHeight: this.height,
      canvasId: this.canvasId
    });
  }
}

export { B2 };
