import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import { connect } from '@tarojs/redux';

import './index.scss';

const Index = function() {
  return <View>hello world</View>;
};

export default connect(() => {})(Index);
