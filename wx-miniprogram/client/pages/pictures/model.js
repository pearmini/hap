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
        fileID:
          'cloud://wechatcloud-79m2p.7765-wechatcloud-79m2p-1259642785/imgs/20181024174733HMwKNRLCwv3KOjEP9NLFJdVXvFb6ZJ.jpeg',
      },
    });
  },
};
