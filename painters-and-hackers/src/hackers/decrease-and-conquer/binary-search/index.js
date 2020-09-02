import {bisectLeft} from './binarySearch';
import {grid, getImageData, random, range, colorArray} from '../../utils/index';

export default {
  name: '二分搜索',
  imageURL:
    'https://7765-wechatcloud-79m2p-1259642785.tcb.qcloud.la/algorithms/decrease-and-conquer/binary-search/1.png?sign=23849f106394ec7d999a587fc8dd84b0&t=1599034348',
  fileID:
    'cloud://wechatcloud-79m2p.7765-wechatcloud-79m2p-1259642785/algorithms/decrease-and-conquer/binary-search/readme.md',
  labels: ['减而治之'],
  type: 2,
  info: '如何快速从世界上找到你的那个Mr.Right？',
  frameRate: 2,
  setup({width, height}) {
    const {cellRow, cellCol} = grid(width, height, 30);

    // data
    const x = random(0, cellCol) | 0;
    const y = random(0, cellRow) | 0;
    const xRanges = [];
    const yRanges = [];
    const stepX = (lo, hi) => xRanges.push([lo, hi]);
    const stepY = (lo, hi) => yRanges.push([lo, hi]);
    bisectLeft(range(0, cellCol), x, {
      step: stepX,
    });
    bisectLeft(range(0, cellRow), y, {
      step: stepY,
    });

    return {
      point: {x, y},
      xRanges,
      yRanges,
      xIndex: 0,
      yIndex: 0,
      areaX: 0,
      areaY: 0,
      areaWidth: cellCol + 1,
      areaHeight: cellRow + 1,
    };
  },
  update({data, width, height, frameCount}) {
    const flag = height > width ? 0 : 1;
    if (
      data.xIndex >= data.xRanges.length &&
      data.yIndex >= data.yRanges.length
    )
      return true;

    if (data.xIndex < data.xRanges.length && frameCount % 2 !== flag) {
      const [lo, hi] = data.xRanges[data.xIndex];
      data.areaX = lo;
      data.areaWidth = hi - lo + 1;
      data.xIndex++;
    }

    if (data.yIndex < data.yRanges.length && frameCount % 2 === flag) {
      const [lo, hi] = data.yRanges[data.yIndex];
      data.areaY = lo;
      data.areaHeight = hi - lo + 1;
      data.yIndex++;
    }

    const colors = colorArray();
    data.style = colors[frameCount % colors.length];
  },
  draw({ctx, width, height, data, imageData}) {
    const {cellRow, cellCol, cellWidth, cellHeight} = grid(width, height, 30);
    const {
      point: {x, y},
      areaX,
      areaY,
      areaWidth,
      areaHeight,
      style,
    } = data;

    // draw current search area
    for (let i = areaX; i < areaX + areaWidth; i++) {
      for (let j = areaY; j < areaY + areaHeight; j++) {
        const index = j * cellCol + i;
        const color = getImageData(imageData, cellRow, cellCol, index);
        ctx.fillStyle = style(color);
        ctx.fillRect(i * cellWidth, j * cellHeight, cellWidth, cellHeight);
      }
    }

    // draw current search point
    ctx.fillStyle = `#fff`;
    ctx.fillRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
  },
};
