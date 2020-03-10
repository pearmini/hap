const cloud = require("wx-server-sdk");
cloud.init();
const db = cloud.database({
  env: "wechatcloud-79m2p"
});

const MAX_LIMIT = 100;
exports.main = async (event, context) => {
  // 先取出集合记录总数
  const dbname = event.dbname;
  const type = event.type;
  const countResult = await db.collection(dbname).count();
  const total = countResult.total;
  if (total === 0) {
    const res = {
      data: []
    };
    return new Promise((r, j) => {
      r(res);
    });
  }
  // 计算需分几次取
  const batchTimes = Math.ceil(total / 100);
  // 承载所有读操作的 promise 的数组
  const tasks = [];
  for (let i = 0; i < batchTimes; i++) {
    const promise = db
      .collection(dbname)
      .where({
        type
      })
      .skip(i * MAX_LIMIT)
      .limit(MAX_LIMIT)
      .get();
    tasks.push(promise);
  }
  // 等待所有
  return (await Promise.all(tasks)).reduce((acc, cur) => {
    return {
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg
    };
  });
};
