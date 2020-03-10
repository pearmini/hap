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
  let countResult;
  const _ = db.command;
  if (type === "img") {
    countResult = await db
      .collection(dbname)
      .where({
        type,
        valid: 1,
        fileid: _.neq("#")
      })
      .count();
  } else {
    countResult = await db
      .collection(dbname)
      .where({
        type
      })
      .count();
  }

  const total = countResult.total;
  // 计算需分几次取
  const batchTimes = Math.ceil(total / 100);
  // 承载所有读操作的 promise 的数组
  const tasks = [];
  for (let i = 0; i < batchTimes; i++) {
    let promise;
    if (type === "img") {
      promise = db
        .collection(dbname)
        .where({
          type,
          valid: 1,
          fileid: _.neq("#")
        })
        .skip(i * MAX_LIMIT)
        .limit(MAX_LIMIT)
        .get();
    } else {
      promise = db
        .collection(dbname)
        .where({
          type
        })
        .skip(i * MAX_LIMIT)
        .limit(MAX_LIMIT)
        .get();
    }

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
