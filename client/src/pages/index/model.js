import indexApi from './service';

export default {
  namespace: 'index',
  state: {
    bodySegImage: {},
  },
  effects: {
    *processImage(action, { call, put }) {
      const { url } = action.payload;
      const { data } = yield call(indexApi.processImage, { url });
      yield put({ type: 'setBodySegImage', payload: { data } });
    },
  },
  reducers: {
    setBodySegImage(state, action) {
      const { data } = action.payload;
      return { ...state, bodySegImage: data };
    },
  },
};
