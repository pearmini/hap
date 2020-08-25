import request from '../../utils/request';

const MAX_COUNT = 20;

export default {
  async get(index = 0, queryText = '', queryLabel = '') {
    const {data} = await request({
      method: 'db',
      name: 'getViewImages',
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
            .reduce((total, cur) => ((total[cur.key] = cur.value), total), {});

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
    return data.reduce((total, cur) => [...total, ...cur.images], []);
  },

  downloadImage(fileId) {
    return request({
      method: 'cloud',
      name: 'downloadImage',
      options: {
        name: 'downloadFile',
        fileID: fileId,
      },
    });
  },

  getLabels: function () {
    return request({
      method: 'fn',
      name: 'getLabels',
      options: {
        name: 'getLabels',
        data: {},
      },
    });
  },
};
