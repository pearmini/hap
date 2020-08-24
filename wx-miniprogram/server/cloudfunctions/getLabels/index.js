// 云函数入口文件
const cloud = require('wx-server-sdk');
cloud.init();

const db = cloud.database();
const MAX_LIMIT = 100;
exports.main = async (event, context) => {
  const countResult = await db.collection('views').count();
  const total = countResult.total;
  const batchTimes = Math.ceil(total / 100);
  const tasks = [];
  for (let i = 0; i < batchTimes; i++) {
    const promise = db
      .collection('views')
      .skip(i * MAX_LIMIT)
      .limit(MAX_LIMIT)
      .get();
    tasks.push(promise);
  }
  const labels = (await Promise.all(tasks)).reduce(
    (acc, cur) => {
      const labels = cur.data.reduce((total, c) => [...total, ...c.labels], []);
      return [...acc, ...labels]
    },
    []
  );

  return Array.from(new Set(labels));
};
