import Vector from './Vector';
import grid from '../../utils/grid';

export default {
  name: 'vector',
  frameRate: 30,
  labels: ['数据结构'],
  imageURL:
    'https://7765-wechatcloud-79m2p-1259642785.tcb.qcloud.la/app/banner.png?sign=df6e5de082dcbd8203b895b838b322db&t=1598350170',
  frames(imageData, width, height) {
    const {cellRow, cellCol} = grid(width, height, 20);
    const x = (i) => ((i % cellCol) * (imageData.width / cellCol)) | 0;
    const y = (i) => (((i / cellCol) | 0) * (imageData.height / cellRow)) | 0;
    const getImageData = (i) => {
      const index = (y(i) * imageData.width + x(i)) * 4;
      return [
        imageData.data[index],
        imageData.data[index + 1],
        imageData.data[index + 2],
        imageData.data[index + 3],
      ];
    };
    const vector = new Vector();
    const actions = getActions();
    return actions;

    function getActions() {
      const totalCnt = cellRow * cellCol;
      const actions = [];
      let currentCnt = 0;

      while (currentCnt < totalCnt) {
        // 在后面加入
        const potentialCnt = (Math.random() * 30) | 0;
        const appendCnt = Math.min(totalCnt - currentCnt, potentialCnt);
        currentCnt += appendCnt;
        for (let i = 0; i < appendCnt; i++) {
          const appendToVector = () => {
            const size = vector.size();
            vector.append(getImageData(size));
            return vector;
          };
          actions.push(appendToVector);
        }
      }
      return actions;
    }
  },
  layout(vector, width, height) {
    const {cellRow, cellCol, cellHeight, cellWidth} = grid(width, height, 20);

    // 背景
    const background = [
      {
        x: 0,
        y: 0,
        width,
        height,
        color: '#fff',
      },
    ];

    // 格子
    const grids = [];
    for (let j = 0; j < cellRow; j++) {
      for (let i = 0; i < cellCol; i++) {
        grids.push({
          x: i * cellWidth,
          y: j * cellHeight,
          width: cellWidth,
          height: cellHeight,
          color: '#eee',
        });
      }
    }

    // 绘制数组容量
    const capacities = [];
    for (let i = 0; i < vector._capacity; i++) {
      const x = i % cellCol;
      const y = (i / cellCol) | 0;
      capacities.push({
        x: x * cellWidth,
        y: y * cellHeight,
        width: cellWidth,
        height: cellHeight,
        color: '#000',
      });
    }

    // 绘制数组元素
    const elements = [];
    for (let i = 0; i < vector.size(); i++) {
      const x = i % cellCol;
      const y = (i / cellCol) | 0;
      const [r, g, b, a] = vector.get(i);
      const v = (r * 0.299 + g * 0.587 + b * 0.114) | 0;
      elements.push({
        x: x * cellWidth + 1,
        y: y * cellHeight + 1,
        width: cellWidth - 2,
        height: cellHeight - 2,
        // color: `rgba(${v}, ${v}, ${v}, ${a})`,
        color: `rgba(${r}, ${g}, ${b}, ${a})`,
      });
    }

    return {
      background,
      grids,
      capacities,
      elements,
    };
  },
  stroke: {
    background(ctx, d) {
      ctx.fillStyle = d.color;
      ctx.fillRect(d.x, d.y, d.width, d.height);
    },
    grids(ctx, d) {
      ctx.strokeStyle = d.color;
      ctx.strokeRect(d.x, d.y, d.width, d.height);
    },
    capacities(ctx, d) {
      ctx.strokeStyle = d.color;
      ctx.strokeRect(d.x, d.y, d.width, d.height);
    },
    elements(ctx, d) {
      ctx.fillStyle = d.color;
      ctx.fillRect(d.x, d.y, d.width, d.height);
    },
  },
};
