import StrokerManger from './stroker-manager/index';
import SamplerManger from './sampler-manager/index';

class Brush {
  constructor() {
    this.samplerManger = new SamplerManger();
    this.strokerManger = new StrokerManger();
    this.frameCount = 30;
    this.config = {
      array: {
        sampler: 'array',
        stroker: 'point',
      },
    };
  }

  setup({imageData, ctx, width, height, method = 'array'}) {
    this.imageData = imageData;
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    const {sampler, stroker} = this.config[method];
    this.sampler = this.samplerManger.get(sampler);
    this.stroker = this.strokerManger.get(stroker);
  }

  draw(cb) {
    const data = this.sampler(this.imageData);
    const timer = setInterval(() => {
      if (data.length === 0) {
        clearInterval(timer);
        cb();
      }
      const renderData = this.data.splice(0, 10);
      renderData.forEach(this.stroker);
    }, 1000 / this.frameCount);
  }
}

export default Brush;
