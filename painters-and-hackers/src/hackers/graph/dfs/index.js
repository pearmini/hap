import dfs from './dfs';
import {configSetup, draw, update} from '../index';

const setup = configSetup(dfs);

export default {
  name: '深度优先搜索',
  imageURL:
    'https://7765-wechatcloud-79m2p-1259642785.tcb.qcloud.la/algorithms/graph/dfs/1.png?sign=f73ac70f70855072871a19374cab6dfb&t=1599377818',
  fileID:
    'cloud://wechatcloud-79m2p.7765-wechatcloud-79m2p-1259642785/algorithms/graph/dfs/readme.md',
  labels: ['图算法'],
  type: 2,
  info: '就是要一条路走到黑',
  frameRate: 100,
  setup,
  draw,
  update,
};
