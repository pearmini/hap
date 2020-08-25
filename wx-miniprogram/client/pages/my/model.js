import request from '../../utils/request';
import ph from '../../lib/painters-and-hackers';

const painterStyles = ph.painters().styles();
const hackerStyles = ph.hackers().styles();

export default {
  getLikes: async function (likes, index) {
    const MAX_COUNT = 20;
    const viewLikes = likes.filter((d) => d.type === 0);
    const artLikes = likes.filter((d) => d.type === 1);
    const codeLikes = likes.filter((d) => d.type === 2);
    const {data: views} = await request({
      method: 'db',
      name: 'getLikes',
      options: {
        query: (db, $, _) =>
          db
            .collection('views')
            .where({
              _id: _.in(viewLikes.map((d) => d.id)),
            })
            .skip(index)
            .limit(MAX_COUNT)
            .get(),
      },
    });

    const arts = artLikes.map((d) => painterStyles.find((p) => p._id === d.id));
    const codes = codeLikes.map((d) =>
      hackerStyles.find((p) => p._id === d.id)
    );
    return {
      views,
      arts,
      codes,
    };
  },

  getUserInfo: function (openid) {
    return request({
      method: 'db',
      name: 'getUserInfo',
      options: {
        query: async (db) => {
          return db.collection('users').where({_openid: openid}).get();
        },
      },
    });
  },
};
