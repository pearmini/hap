import Vector from './Vector';
import {grid, getImageData, random} from '../../utils/index';

const ADD = 0;
const REMOVE = 1;
const INSERT = 2;
const END = 3;

export default {
  name: '向量',
  nameE: 'Vector',
  frameRate: 10,
  labels: ['数据结构'],
  info: '看露天电影的时候如何更加优雅地安排座位？',
  fileID: 'cloud://wechatcloud-79m2p.7765-wechatcloud-79m2p-1259642785/algorithms/data-structures/vector/readme.md',
  type: 2,
  imageURL:
    'https://7765-wechatcloud-79m2p-1259642785.tcb.qcloud.la/algorithms/data-structures/vector/3.png?sign=9de7df125e4385110c1fcb122f031aaf&t=1598836449',
  setup: function (ctx, width, height) {
    const {cellRow, cellCol} = grid(width, height, 20);
    const vectorList = [];
    for (let i = 0; i < cellRow; i++) {
      vectorList.push({
        vector: new Vector(),
        state: ADD,
        appendSize: random(1, cellCol / 3) | 0,
        removeSize: 0,
        insertList: [],
      });
    }
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, width, height);
    return vectorList;
  },
  update: function (vectorList, width, height) {
    const {cellCol} = grid(width, height, 20);
    const isEnd = vectorList.every((d) => d.state === END);
    if (isEnd) return true;
    for (let i = 0; i < vectorList.length; i++) {
      const o = vectorList[i];
      const {vector, state} = o;
      const actionByState = {
        [ADD]: function () {
          const value = vector.size();
          vector.append(value);
          o.appendSize--;
          if (o.appendSize === 0) {
            if (vector.size() >= cellCol) {
              o.state = END;
            } else {
              const range = [1 / 3, 2 / 3];
              o.state = REMOVE;
              o.removeSize =
                random(vector.size() * range[0], vector.size() * range[1]) | 0;
            }
          }
        },
        [REMOVE]: function () {
          if (o.removeSize <= 0) {
            o.state = INSERT;
          } else {
            const removeIndex = random(0, vector.size()) | 0;
            const value = vector.remove(removeIndex);
            o.removeSize--;
            o.insertList.push({
              removeIndex,
              value,
            });
          }
        },
        [INSERT]: function () {
          if (o.insertList.length === 0) {
            o.state = ADD;
            o.appendSize = random(1, cellCol - vector.size()) | 0;
          } else {
            const {value, removeIndex} = o.insertList.pop();
            vector.insert(removeIndex, value);
          }
        },
        [END]: function () {},
      };
      const action = actionByState[state];
      action();
    }
  },
  draw: function (ctx, width, height, vectorList, imageData) {
    const {cellRow, cellCol, cellWidth, cellHeight} = grid(width, height, 20);

    ctx.clearRect(0, 0, width, height);

    // draw grids
    for (let j = 0; j < cellRow; j++) {
      for (let i = 0; i < cellCol; i++) {
        ctx.strokeStyle = '#eee';
        ctx.strokeRect(i * cellWidth, j * cellHeight, cellWidth, cellHeight);
      }
    }

    // draw array
    for (let i = 0; i < vectorList.length; i++) {
      const {vector} = vectorList[i];

      // draw capacity
      for (let j = 0; j < vector._capacity; j++) {
        ctx.strokeStyle = '#000';
        ctx.strokeRect(j * cellWidth, i * cellHeight, cellWidth, cellHeight);
      }

      // draw size
      for (let j = 0; j < vector.size(); j++) {
        const index = i * cellCol + vector.get(j);
        const [r, g, b, a] = getImageData(imageData, cellRow, cellCol, index);
        const style = `rgba(${r}, ${g}, ${b}, ${a})`;
        ctx.fillStyle = style;
        ctx.strokeStyle = style;
        ctx.strokeRect(j * cellWidth, i * cellHeight, cellWidth, cellHeight);
        ctx.fillRect(j * cellWidth, i * cellHeight, cellWidth, cellHeight);
      }
    }
  },
};
