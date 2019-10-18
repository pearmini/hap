// 使用了 async await 语法
const cloud = require('wx-server-sdk');
cloud.init();
const db = cloud.database({
  env: 'wechatcloud-79m2p'
})

exports.main = (event, context) => {
  return db.collection('learns').where({
    openid: event.openid,
    did: event.did
  }).remove();
}