import promisify from './promisify';

const db = wx.cloud.database();
const MAX_LIMIT = 20;
const getImageInfo = promisify(wx.getImageInfo);
const uploadFile = promisify(wx.cloud.uploadFile);

async function getAllViews() {
  const countResult = await db.collection('views').count();
  const total = countResult.total;
  const batchTimes = Math.ceil(total / MAX_LIMIT);
  const tasks = [];
  for (let i = 0; i < batchTimes; i++) {
    const promise = db
      .collection('views')
      .skip(i * MAX_LIMIT)
      .limit(MAX_LIMIT)
      .get();
    tasks.push(promise);
  }
  return (await Promise.all(tasks)).reduce(
    (acc, cur) => [...acc, ...cur.data],
    []
  );
}

async function upload(cloudPath, filePath) {
  const {fileID} = await uploadFile({
    cloudPath,
    filePath,
  });
  return fileID;
}

function addImage(url, fileId) {
  return db.collection('images').add({
    data: {
      url,
      fileId,
    },
  });
}

export default async () => {
  const views = await getAllViews();
  const redViews = views.filter((d) => d.isRed);
  for (let v of redViews) {
    const {images} = v;
    for (let [url] of images) {
      const segs = url.split('/');
      const name = segs[segs.length - 1];
      const cloudPath = `red_imgs/${name}`;
      const {path} = await getImageInfo({src: url});
      const fileID = await upload(cloudPath, path);
      await addImage(url, fileID);
    }
  }
};
