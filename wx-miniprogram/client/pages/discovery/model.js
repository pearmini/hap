import request from '../../utils/request';
import ph from '../../lib/painters-and-hackers';

const MAX_COUNT = 20;
const painterStyles = ph.painters().styles();
const hackerStyles = ph.hackers().styles();

export default {
  get: function (type) {
    if (type === 0) {
      return request({
        method: 'db',
        name: 'getViewData',
        options: {
          query: (db) => {
            return db.collection('views').get();
          },
        },
      });
    } else if (type === 1) {
      return {
        data: painterStyles,
      };
    }
  },
  count: async function () {
    const {list} = await request({
      method: 'db',
      name: 'getViewCount',
      options: {
        query: (db) => {
          return db
            .collection('views')
            .aggregate()
            .match({
              type: 0,
            })
            .count('count')
            .end();
        },
      },
    });
    return [list[0].count, painterStyles.length, hackerStyles.length];
  },
};
