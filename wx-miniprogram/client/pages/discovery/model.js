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
          query: (db, $, _) => {
            const name = {
              key: 'name',
              value: queryText
                ? db.RegExp({
                    regexp: queryText,
                  })
                : null,
            };

            const labels = {
              key: 'labels',
              value: queryLabel ? _.all([queryLabel]) : null,
            };

            const conditions = [name, labels]
              .filter((d) => d.value)
              .reduce((total, cur) => (total[cur.key] = cur.value, total), {});

            if (Object.keys(conditions).length) {
              return db
                .collection('views')
                .where(conditions)
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
          .filter((d) => (queryText ? d.name.search(queryText) !== -1 : d.name))
          .filter((d) =>
            queryLabel ? d.labels.indexOf(queryLabel) !== -1 : true
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
