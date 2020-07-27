import detailApi from './service';

export default {
  namespace: 'detail',
  state: {
    md: '',
  },
  effects: {
    *download(action, { call, put }) {
      const { fileid } = action.payload;
      const tempFilePath = yield call(detailApi.download, { fileid });
      const { data: md } = yield call(detailApi.readFile, { tempFilePath });
      yield put({ type: 'setMD', payload: { md } });
    },
  },
  reducers: {
    setMD(state, action) {
      const { md } = action.payload;
      return { ...state, md };
    },
  },
};
