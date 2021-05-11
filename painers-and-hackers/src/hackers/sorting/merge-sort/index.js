import {configSetup, draw, update} from '../index';
import mergeSort from './mergeSort';
const setup = configSetup(mergeSort);

export default {
  name: '归并排序',
  imageURL:
    'https://7765-wechatcloud-79m2p-1259642785.tcb.qcloud.la/algorithms/sorting/merge-sort/1.png?sign=d92ebd0619e65561c7590ca45f1b69d9&t=1599215583',
  fileID:
    'cloud://wechatcloud-79m2p.7765-wechatcloud-79m2p-1259642785/algorithms/sorting/merge-sort/readme.md',
  labels: ['排序算法', '分而治之'],
  type: 2,
  info: '三个臭皮匠顶一个诸葛亮！',
  frameRate: 5,
  setup,
  update,
  draw,
};
