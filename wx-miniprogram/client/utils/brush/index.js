import drawVector from './data-structures/vector/index';

class Brush {
  constructor() {
    this.frameCount = 30;
    this.speed = 10;
    this.config = {
      array: {
        sampler: 'array',
        stroker: 'square',
      },
      list: {
        sampler: 'list',
        stroker: 'square',
      },
    };
  }

  setup({imageData, ctx, width, height, method = 'array'}) {
    this.imageData = imageData;
    this.ctx = ctx;
    this.width = width;
    this.height = height;
  }

  draw(cb) {
    drawVector({
      imageData: this.imageData,
      ctx: this.ctx,
      width: this.width,
      height: this.height,
      cb,
    });
  }
}

export default Brush;
