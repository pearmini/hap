// 云函数入口文件
const cloud = require('wx-server-sdk');
const https = require('https');

cloud.init();

function downloadImage(url) {
  return new Promise((resolve) => {
    https.get(url, (data) => {
      const array = [];
      data.on('data', (chunk) => {
        array.push(chunk);
      });
      data.on('end', () => {
        const buffer = Buffer.concat(array.map((d) => Buffer.from(d)));
        resolve(buffer);
      });
    });
  });
}

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const {url} = event;
    const buffer = await downloadImage(url);
    const res = await cloud.openapi.security.imgSecCheck({
      media: {
        header: {'Content-Type': 'application/octet-stream'},
        contentType: 'image/png',
        value: buffer,
      },
    });
    return res;
  } catch (e) {
    return {
      result: {
        errCode: 1,
      },
    };
  }
};
