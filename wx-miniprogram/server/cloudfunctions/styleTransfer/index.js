const cloud = require('wx-server-sdk');
const request = require('request');
const fs = require('fs');
const deepai = require('deepai');
deepai.setApiKey('79c92106-c2e4-4c9e-8835-585ffb6eba46');
cloud.init();

function downloadImage(output_url, OPENID) {
  return new Promise((resolve) => {
    const timestamp = Date.now() % 100;
    const localPath = `/tmp/${OPENID}_${timestamp}.png`;
    const writeStream = fs.createWriteStream(localPath);
    writeStream.on('finish', async function () {
      const fileStream = fs.createReadStream(localPath);
      const {fileID} = await cloud.uploadFile({
        cloudPath: `tempImages/${OPENID}/result_${timestamp}.png`,
        fileContent: fileStream,
      });
      resolve(fileID);
    });
    request(output_url).pipe(writeStream);
  });
}

exports.main = async (event, context) => {
  const {OPENID} = cloud.getWXContext();
  const {styleImageURL, contentImageURL} = event;
  const {output_url} = await deepai.callStandardApi('fast-style-transfer', {
    content: contentImageURL,
    style: styleImageURL,
  });

  // 将图片下载到本地
  const fileID = await downloadImage(output_url, OPENID);
  return {
    fileID,
    output_url,
  };
};
