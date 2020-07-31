import Taro, {
  useState,
  useDidShow,
  useEffect,
  useCallback,
} from '@tarojs/taro';
import { View, Image, Text, Canvas } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import { AtButton, AtIcon, AtSegmentedControl } from 'taro-ui';

import './index.scss';

function Index({ dispatch, loading, frontImage, backgroundImage, filters }) {
  const [selfie, setSelfie] = useState('');
  const [background, setBackground] = useState({});
  const [filterType, setFilterType] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState(null);

  let canvasWidth, canvasHeight;
  if (backgroundImage.url) {
    canvasWidth = 700;
    canvasHeight =
      (canvasWidth * backgroundImage.height) / backgroundImage.width;
  } else {
    canvasWidth = 0;
    canvasHeight = 0;
  }

  const drawImage = useCallback(
    (canvas, ctx, dpr) => {
      const back = canvas.createImage();
      back.src = backgroundImage.url;
      back.onload = () => {
        ctx.drawImage(back, 0, 0, canvasWidth * dpr, canvasHeight * dpr);
        const front = canvas.createImage();
        front.src = frontImage.url;
        front.onload = () => {
          const backRatio = backgroundImage.width / backgroundImage.height;
          const frontRatio = frontImage.width / frontImage.height;
          let width, height;
          let x = 0,
            y = 0;
          if (backRatio > frontRatio) {
            height = canvasHeight * dpr;
            width = height * frontRatio;
          } else {
            width = canvasWidth * dpr;
            height = width / frontRatio;
            y = (canvasHeight - height / dpr) * dpr;
          }
          ctx.drawImage(front, x, y, width, height);
        };
      };
    },
    [backgroundImage, frontImage, canvasHeight, canvasWidth]
  );

  useDidShow(() => {
    const selectedImage = Taro.getStorageSync('selected_image');
    if (selectedImage) {
      const image = JSON.parse(selectedImage);
      setBackground(image);
      dispatch({ type: 'index/processBackgroundImage', payload: { image } });
      Taro.removeStorageSync('selected_image');
    }
  });

  useEffect(() => {
    if (backgroundImage.url && frontImage.url) {
      const query = Taro.createSelectorQuery();
      query
        .select('#app-canvas')
        .fields({ node: true, size: true })
        .exec(res => {
          const canvas = res[0].node;
          const ctx = canvas.getContext('2d');
          const dpr = Taro.getSystemInfoSync().pixelRatio;
          canvas.width = canvasWidth * dpr;
          canvas.height = canvasHeight * dpr;
          ctx.save();
          ctx.scale(dpr, dpr);
          drawImage(canvas, ctx, dpr);
          ctx.restore();
        });
    }
  }, [backgroundImage, frontImage, drawImage, canvasHeight, canvasWidth]);

  useEffect(() => {
    dispatch({ type: 'index/getFilters' });
  }, [dispatch]);

  function handleSelectImage() {
    Taro.navigateTo({
      url: '/pages/pictures/index',
    });
  }

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
              type: 'index/processFrontImage',
              payload: { url: data.data },
            });
          },
        });
      },
    });
  }

  function handleDrawImage(filter) {
    if (filter.type === 1) {
      const dpr = Taro.getSystemInfoSync().pixelRatio;
      Taro.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: canvasWidth * dpr,
        height: canvasHeight * dpr,
        destWidth: canvasWidth * dpr,
        destHeight: canvasWidth * dpr,
        success(res) {
          console.log(res.tempFilePath);
        },
      });
    } else {
    }
  }

  return (
    <View className='container'>
      <AtButton size='small' onClick={handleSelectImage}>
        选择背景图片
      </AtButton>
      {background.url && (
        <View>
          <Image src={background.url} mode='aspectFill' />
          {loading ? (
            <Text>下载中...</Text>
          ) : (
            <AtIcon value='trash' onClick={() => setBackground({})} />
          )}
          <AtIcon value='upload' onClick={handleUploadImage} />
        </View>
      )}
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

      {backgroundImage.url && frontImage.url && (
        <Canvas
          id='app-canvas'
          type='2d'
          style={{ width: canvasWidth + 'rpx', height: canvasHeight + 'rpx' }}
        ></Canvas>
      )}
      <Text>选择滤镜</Text>
      <AtSegmentedControl
        values={['画家', '骇客']}
        onClick={setFilterType}
        current={filterType}
      />
      {filters
        .filter(d => d.type === filterType + 1)
        .map(d => (
          <View
            key={d._id}
            style={{
              border:
                selectedFilter &&
                selectedFilter._id === d._id &&
                'solid 2rpx red',
            }}
          >
            <Image
              src={d.coveryImageUrl}
              onClick={() => setSelectedFilter(d)}
            ></Image>
          </View>
        ))}
      <AtButton size='small' onClick={() => handleDrawImage(selectedFilter)}>
        开始绘制
      </AtButton>
    </View>
  );
}

export default connect(({ index, loading }) => ({
  ...index,
  loading: loading.models.index,
}))(Index);
