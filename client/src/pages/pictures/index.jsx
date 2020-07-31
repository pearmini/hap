import Taro, { useEffect } from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import { connect } from '@tarojs/redux';

import './index.scss';

function Pictures({ list, dispatch, loading }) {
  useEffect(() => {
    dispatch({ type: 'pictures/getData' });
  }, [dispatch]);

  return (
    <View className='container'>
      {loading
        ? '加载中...'
        : list.map(d => (
            <Image
              key={d.id}
              src={d.coveryImageUrl}
              onClick={() => {
                const value = JSON.stringify({
                  url: d.coveryImageUrl,
                  fileid: d.imageFileId,
                });
                Taro.setStorageSync('selected_image', value);
                Taro.navigateBack(-1);
              }}
            />
          ))}
    </View>
  );
}

Pictures.config = {
  navigationBarTitleText: '图片',
};

export default connect(({ pictures, loading }) => ({
  ...pictures,
  loading: loading.models.pictures,
}))(Pictures);
