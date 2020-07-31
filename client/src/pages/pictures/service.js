import request from '../../utils/request';

const get = () =>
  request({
    method: 'db',
    name: 'getData',
    query: db =>
      db
        .collection('items')
        .where({
          type: 0,
        })
        .get(),
  });

export default {
  get,
};
