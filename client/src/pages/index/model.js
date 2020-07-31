import Taro from '@tarojs/taro';

import indexApi from './service';
import promisitic from '../../utils/promisitic';

const downloadFile = promisitic(Taro.cloud.downloadFile);
const getImageInfo = promisitic(Taro.getImageInfo);

export default {
  namespace: 'index',
  state: {
    frontImage: {},
    backgroundImage: {},
    seging: false,
    downloading: false,
    filters: [],
  },
  effects: {
    *processFrontImage(action, { call, put }) {
      const { url } = action.payload;
      const { data } = yield call(indexApi.processImage, { url });
      const filePath = `${Taro.env.USER_DATA_PATH}/tmp.png`;
      const buffer = Taro.base64ToArrayBuffer(data.foreground);
      const fsm = Taro.getFileSystemManager();
      fsm.writeFileSync(filePath, buffer, 'binary');
      const { width, height, path } = yield getImageInfo({ src: filePath });

      yield put({
        type: 'setFrontImage',
        payload: {
          data: {
            url: path,
            width,
            height,
          },
        },
      });
    },
    *processBackgroundImage(action, { put }) {
      const { image } = action.payload;
      const { tempFilePath } = yield downloadFile({
        fileID: image.fileid,
      });
      const { width, height, path } = yield getImageInfo({ src: tempFilePath });
      yield put({
        type: 'setBackgroundImage',
        payload: {
          data: {
            url: path,
            width,
            height,
          },
        },
      });
    },
    *getFilters(_, { call, put }) {
      const { data } = yield call(indexApi.getFilters);
      yield put({
        type: 'setFilters',
        payload: {
          data,
        },
      });
    },
  },
  reducers: {
    setFrontImage(state, action) {
      const { data } = action.payload;
      return { ...state, frontImage: data };
    },
    setBackgroundImage(state, action) {
      const { data } = action.payload;
      return { ...state, backgroundImage: data };
    },
    setFilters(state, action) {
      const { data } = action.payload;
      return { ...state, filters: data };
    },
  },
};
