import Taro, { useState } from '@tarojs/taro';
import { View, Image, Text } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import { AtButton, AtIcon } from 'taro-ui';

import './index.scss';

function Index({ dispatch, bodaySegIamge, loading }) {
  const [selfie, setSelfie] = useState('');

  function handleUploadImage() {
    Taro.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        const path = res.tempFilePaths[0];
        setSelfie(path);
        const FSM = Taro.getFileSystemManager();
        FSM.readFile({
          filePath: path,
          encoding: 'base64',
          success: function(data) {
            dispatch({
              type: 'index/processImage',
              payload: { url: data.data },
            });
          },
        });
      },
    });
  }

  return (
    <View className='container'>
      <AtButton size='small'>选择背景图片</AtButton>
      <AtButton size='small' onClick={handleUploadImage}>
        选择自拍
      </AtButton>
      {selfie !== '' && (
        <View>
          <Image src={selfie} mode='aspectFill' />
          {loading ? (
            <Text>分割中...</Text>
          ) : (
            <AtIcon value='trash' onClick={() => setSelfie('')} />
          )}
          <AtIcon value='upload' onClick={handleUploadImage} />
        </View>
      )}
      <AtButton size='small'>选择滤镜</AtButton>
      <AtButton size='small'>开始绘制</AtButton>
    </View>
  );
}

export default connect(({ index, loading }) => ({
  ...index,
  loading: loading.models.index,
}))(Index);
