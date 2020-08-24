import request from '../../utils/request';
import ph from '../../lib/painters-and-hackers';

const MAX_COUNT = 20;
const painterStyles = ph.painters().styles();
const painterLabels = ph.painters().labels();
const hackerStyles = ph.hackers().styles();
const hackerLabels = ph.hackers().labels();

export default {
  get: function (type, index = 0, queryText, queryLabel) {
    if (type === 0) {
      return request({
        method: 'db',
        name: 'getViewData',
        options: {
          query: (db) => {
            if (queryText) {
              return db
                .collection('views')
                .where({
                  name: db.RegExp({
                    regexp: queryText,
                  }),
                })
                .skip(index)
                .limit(MAX_COUNT)
                .get();
            } else {
              return db.collection('views').skip(index).limit(MAX_COUNT).get();
            }
          },
        },
      });
    } else if (type === 1) {
      return {
        data: painterStyles
          .slice(index, MAX_COUNT)
          .filter((d) =>
            queryText ? d.name.search(queryText) !== -1 : d.name
          ),
      };
    }
  },
  getLabels: function (type) {
    if (type === 0) {
      return request({
        method: 'fn',
        name: 'getLabels',
        options: {
          name: 'getLabels',
          data: {},
        },
      });
    } else if (type === 1) {
      return {result: painterLabels};
    } else {
      return {result: hackerLabels};
    }
  },
};
