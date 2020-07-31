import picturesApi from './service';

export default {
  namespace: 'pictures',
  state: {
    list: [],
  },
  effects: {
    *getData(_, { call, put }) {
      const { data } = yield call(picturesApi.get);
      yield put({ type: 'concatList', payload: { data } });
    },
  },
  reducers: {
    concatList(state, action) {
      const { list } = state;
      const { data } = action.payload;
      return { ...state, list: [...list, ...data] };
    },
  },
};
