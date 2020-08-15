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
  }
};
