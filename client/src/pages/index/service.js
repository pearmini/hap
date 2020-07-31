import request from '../../utils/request';

const API_KEY = 'UNmEgzrGA1gAXGS9TgO4U7gN';
const SECRET_KEY = 'SdZWPYqrh9iUt3KUDcujSXek0elVOGSl';

const processImage = ({ url }) =>
  request({
    name: 'getAccessToken',
    method: 'request',
    data: {
      url: `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${API_KEY}&client_secret=${SECRET_KEY}&`,
      method: 'POST',
    },
  }).then(res => {
    const accessToken = res.data.access_token;
    return request({
      name: 'bodySeg',
      method: 'request',
      data: {
        url: `https://aip.baidubce.com/rest/2.0/image-classify/v1/body_seg?access_token=${accessToken}`,
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        method: 'POST',
        data: {
          image: url,
          type: ['foreground'],
        },
      },
    });
  });

const getFilters = () =>
  request({
    method: 'db',
    name: 'getFilters',
    query: (db, _) =>
      db
        .collection('items')
        .where(
          _.or(
            {
              type: 1,
            },
            { type: 2 }
          )
        )
        .get(),
  });

export default {
  processImage,
  getFilters,
};
