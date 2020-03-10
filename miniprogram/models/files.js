class FileModel {
  get(fileID) {
    return new Promise((resolve, reject) => {
      wx.cloud.downloadFile({
        fileID,
        success: res => {
          resolve(res);
        },
        fail: error => {
          reject(error);
        }
      });
    });
  }

  delete(fileID) {
    return new Promise((resolve, reject) => {
      wx.cloud.deleteFile({
        fileList: [fileID],
        success: res => {
          resolve();
        }
      });
    });
  }

  add(url, filename) {
    return new Promise((resovle, reject) => {
      wx.cloud.uploadFile({
        cloudPath: filename,
        filePath: url,
        success: res => {
          resovle(res);
        },
        fail: console.error
      });
    });
  }
}

export { FileModel };
