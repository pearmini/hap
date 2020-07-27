import Taro, { useState, useEffect } from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import { AtSegmentedControl } from 'taro-ui';

import './index.scss';

function Discovery({ dispatch, list, loading }) {
  const [currentType, setCurrentType] = useState(1);
  const names = list.map(d => d.name);
  const { data } = list.find(d => d.type === currentType);

  useEffect(() => {
    if (data.length === 0) {
      dispatch({ type: 'discovery/getData', payload: { type: currentType } });
    }
  }, [currentType, dispatch, data.length]);

  return (
    <View className='container'>
      <AtSegmentedControl
        values={names}
        current={currentType}
        onClick={setCurrentType}
      />
      {loading ? (
        <View>加载中...</View>
      ) : data.length === 0 ? (
        <View>没有数据</View>
      ) : (
        data.map(item => (
          <View
            key={item}
            onClick={() => {
              Taro.navigateTo({
                url: `/pages/detail/index?fileid=${item.articleFileId}`,
              });
            }}
          >
            <View>{item.name}</View>
            <View>{item.info}</View>
            <Image src={item.coveryImageUrl} />
          </View>
        ))
      )}
    </View>
  );
}

Discovery.config = {
  navigationBarTitleText: '发现',
};

export default connect(({ discovery, loading }) => ({
  ...discovery,
  loading: loading.models.discovery,
}))(Discovery);
