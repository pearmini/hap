import bfs from './bfs';
import {configSetup, draw, update} from '../index';

const setup = configSetup(bfs);

export default {
  name: '宽度优先搜索',
  imageURL:
    'https://7765-wechatcloud-79m2p-1259642785.tcb.qcloud.la/algorithms/graph/bfs/1.png?sign=712be72b9ea9c31d72f98c49f8ec1073&t=1599377568',
  fileID:
    'cloud://wechatcloud-79m2p.7765-wechatcloud-79m2p-1259642785/algorithms/graph/bfs/readme.md',
  labels: ['图算法'],
  type: 2,
  info: '来一场说走就走的旅行吧',
  frameRate: 100,
  setup,
  update,
  draw,
};
