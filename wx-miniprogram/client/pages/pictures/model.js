import request from '../../utils/request';

export default {
  get() {
    return request({
      method: 'db',
      name: 'getViewImages',
      options: {
        query: (db) => {
          return db.collection('views').get();
        },
      },
    });
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
};
