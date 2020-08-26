import request from '../../utils/request';
import promisify from '../../utils/promisify';

const uploadFile = promisify(wx.cloud.uploadFile);
const downloadFile = promisify(wx.cloud.downloadFile);
const getTempFileURL = promisify(wx.cloud.getTempFileURL);

export default {
  async styleTransfer(contentImagePath, styleImagePath, openID) {
    // 上传图片
    const base = `tempImages/${openID}`;
    const {fileID: contentImageFileID} = await uploadFile({
      cloudPath: `${base}/content.png`,
      filePath: contentImagePath,
    });
    const {fileID: styleImageFileID} = await uploadFile({
      cloudPath: `${base}/style.png`,
      filePath: styleImagePath,
    });

    // 获得下载链接
    const {fileList} = await getTempFileURL({
      fileList: [contentImageFileID, styleImageFileID],
    });

    // 调用云函数
    const {result} = await request({
      method: 'fn',
      name: 'styleTransfer',
      options: {
        name: 'styleTransfer',
        data: {
          contentImageURL: fileList[0].tempFileURL,
          styleImageURL: fileList[1].tempFileURL,
        },
      },
    });

    const {tempFilePath} = await downloadFile({
      fileID: result.fileID,
    });

    return tempFilePath;
  },
};
