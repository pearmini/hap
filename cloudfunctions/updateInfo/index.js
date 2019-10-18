// 使用了 async await 语法
const cloud = require('wx-server-sdk');
cloud.init();
const db = cloud.database({
  env: 'wechatcloud-79m2p'
})

const dbname = 'goods';
exports.main = (event, context) => {
  return db.collection(dbname).where({
    type: 'img_index'
  }).update({
    data: event.data
  })
}