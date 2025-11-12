import {draw, configSetup, update} from '../index';
import insertionSort from './insertionSort';
const setup = configSetup(insertionSort);

export default {
  name: '插入排序',
  imageURL:
    'https://7765-wechatcloud-79m2p-1259642785.tcb.qcloud.la/algorithms/sorting/insertion-sort/2.png?sign=a781a8ee74210d11ae39e801f65f092c&t=1599215300',
  fileID:
    'cloud://wechatcloud-79m2p.7765-wechatcloud-79m2p-1259642785/algorithms/sorting/insertion-sort/reame.md',
  labels: ['排序算法', '减而治之'],
  type: 2,
  info: '打牌时最常用的算法',
  frameRate: 5,
  setup,
  update,
  draw,
};
