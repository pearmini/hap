import request from '../../utils/request';

export default {
  get: async function (item) {
    if (item.type === 0) {
      return `# ${item.name} \n![Alt](${
        item.imageURL
      }) \n## 标签 \n${item.labels.join(' ')} \n## 图片介绍 \n${
        item.info
      } \n## 相关介绍 \n${item.des} \n## 数据来源 \n- 上海图书馆知识竞赛 ${
        item.isRed ? '' : '\n- 百度百科'
      }`;
    } else {
      const fileSystemManager = wx.getFileSystemManager();
      const readFile = promisify(fileSystemManager.readFile);
      const downloadFile = promisify(wx.cloud.downloadFile);
      const {tempFilePath} = await downloadFile({fileID: item.fileID});
      const {data} = await readFile({
        filePath: tempFilePath,
        encoding: 'utf-8',
      });
      return data;
    }
  },
  getLike: async function (type, id, openid) {
    const {data} = await request({
      method: 'db',
      name: 'getLike',
      options: {
        query: (db, $, _) =>
          db
            .collection('users')
            .where({
              _openid: openid,
              likes: _.elemMatch({
                id,
                type,
              }),
            })
            .get(),
      },
    });
    return data.length !== 0;
  },
  setLike: async function (type, id, userInfoId, value) {
    return request({
      method: 'db',
      name: 'setLike',
      options: {
        query: (db, $, _) => {
          const likes = value
            ? _.push([{type, id}])
            : _.pull({
                type,
                id,
              });
          return db
            .collection('users')
            .doc(userInfoId)
            .update({
              data: {
                likes,
              },
            })
        },
      },
    });
  },
};
