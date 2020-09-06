import prim from './prim';
import {configSetup, draw, update} from '../index';

const setup = configSetup(prim);

export default {
  name: '普里姆算法',
  imageURL:
    'https://7765-wechatcloud-79m2p-1259642785.tcb.qcloud.la/algorithms/graph/prim/10.png?sign=9493d4e329f0576909fc6ee21fb391ad&t=1599378239',
  fileID:
    'cloud://wechatcloud-79m2p.7765-wechatcloud-79m2p-1259642785/algorithms/graph/prim/readme.md',
  labels: ['图算法'],
  type: 2,
  info: '“穷国王”如何修建铁路？',
  setup,
  draw,
  update,
};
