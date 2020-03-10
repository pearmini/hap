const cloud = require("wx-server-sdk");
cloud.init();
const db = cloud.database({
  env: "wechatcloud-79m2p"
});

const dbname = "goods";
exports.main = (event, context) => {
  const { id, data } = event;
  return db
    .collection(dbname)
    .where({
      id
    })
    .update({
      data
    });
};
