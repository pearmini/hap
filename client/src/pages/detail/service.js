import request from '../../utils/request';

const download = ({ fileid }) =>
  request({
    method: 'rest',
    name: 'download',
    cb: Taro =>
      new Promise((resolve, reject) => {
        Taro.cloud.downloadFile({
          fileID: fileid,
          success: res => {
            resolve(res.tempFilePath);
          },
          fail: reject,
        });
      }),
  });

const readFile = ({ tempFilePath }) =>
  request({
    method: 'rest',
    name: 'readFile',
    cb: Taro =>
      new Promise((resolve, reject) => {
        const FileSystemManager = Taro.getFileSystemManager();
        FileSystemManager.readFile({
          filePath: tempFilePath,
          encoding: 'utf-8',
          success: res => {
            resolve(res);
          },
          fail: reject,
        });
      }),
  });

export default {
  download,
  readFile,
};
