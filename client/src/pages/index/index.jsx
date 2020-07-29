import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtButton } from 'taro-ui';

import './index.scss';

function Index() {
  return (
    <View>
      <AtButton size='small'>选择背景图片</AtButton>
      <AtButton size='small'>选择自拍</AtButton>
      <AtButton size='small'>选择滤镜</AtButton>
      <AtButton size='small'>开始绘制</AtButton>
    </View>
  );
}

export default Index;
