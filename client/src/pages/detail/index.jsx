import Taro, { useRouter, useEffect } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import TaroParser from 'taro-parse';

import './index.scss';

function Detail({ dispatch, md, loading }) {
  const {
    params: { fileid },
  } = useRouter();

  useEffect(() => {
    dispatch({ type: 'detail/download', payload: { fileid } });
  }, [dispatch, fileid]);

  return (
    <View>
      {loading ? (
        '加载中'
      ) : md === '' ? (
        '没有数据'
      ) : (
        <View>
          <TaroParser
            type='markdown'
            theme='light'
            onImgClick={() => {}}
            onLinkClick={() => {}}
            onLoaded={() => {}}
            content={md}
          />
        </View>
      )}
    </View>
  );
}

Detail.config = {
  navigationBarTitleText: '文章',
};

export default connect(({ detail, loading }) => ({
  ...detail,
  loading: loading.models.detail,
}))(Detail);
