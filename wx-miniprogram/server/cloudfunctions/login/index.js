// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();
const db = cloud.database();

// 云函数入口函数
exports.main = async () => {
  const {OPENID} = cloud.getWXContext();
  const {data} = await db
    .collection('users')
    .where({
      _openid: OPENID,
    })
    .get();

  let _id;
  if (!data.length) {
    const res = await db.collection('users').add({
      data: {
        likes: [],
        _openid: OPENID,
      },
    });
    _id = res._id;
  } else {
    _id = data[0]._id;
  }
  return {OPENID, userInfoId: _id};
};
