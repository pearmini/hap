// 云函数入口文件
const cloud = require("wx-server-sdk");
const cheerio = require("cheerio");
const request = require("request");

cloud.init();

// 云函数入口函数
exports.main = (event, context) => {
  const key = event.key;
  const url = encodeURI(`https://baike.baidu.com/item/${key}`);
  return new Promise((resolve, reject) => {
    request(url, (err, res, body) => {
      if (!err && res.statusCode === 200) {
        const $ = cheerio.load(body);
        const raw = $(".lemma-summary > .para").text();
        const data = raw.replace(/(\[.*\])/g, "").replace(/\n/g, "");
        resolve(data);
      }
    });
  });
};
