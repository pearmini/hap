import request from '../../utils/request';

const get = ({ type }) =>
  request({
    method: 'db',
    name: 'getData',
    query: db =>
      db
        .collection('items')
        .where({
          type,
        })
        .get(),
  });

export default {
  get,
};
