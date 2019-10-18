// 使用了 async await 语法
const cloud = require('wx-server-sdk');
cloud.init();
const db = cloud.database({
  env: 'wechatcloud-79m2p'
})

const dbname = 'labels';
exports.main = (event, context) => {
  const { labels } = event;
  const list = [];
  for(let l of labels){
    const add = db.collection(dbname).add({
      data:l
    })
    list.push(add);
  }
  return Promise.all(list);
}