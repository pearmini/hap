import discoveryApi from './service';

export default {
  namespace: 'discovery',
  state: {
    list: [
      {
        name: '上海景点',
        type: 0,
        data: [],
      },
      {
        name: '画家',
        type: 1,
        data: [],
      },
      {
        name: '骇客',
        type: 2,
        data: [],
      },
    ],
  },
  effects: {
    *getData(action, { call, put }) {
      const { type } = action.payload;
      const { data } = yield call(discoveryApi.get, { type });
      yield put({ type: 'concatList', payload: { data, type } });
    },
  },
  reducers: {
    concatList(state, action) {
      const newList = [...state.list];
      const { data, type } = action.payload;
      const item = newList.find(d => d.type === type);
      item.data = [...item.data, ...data];
      return { ...state, list: newList };
    },
  },
};
