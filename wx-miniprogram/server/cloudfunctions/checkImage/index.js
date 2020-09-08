// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const {buffer} = event;
    const res = await cloud.openapi.security.imgSecCheck({
      media: {
        header: {'Content-Type': 'application/octet-stream'},
        contentType: 'image/png',
        value: Buffer.from(buffer),
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
