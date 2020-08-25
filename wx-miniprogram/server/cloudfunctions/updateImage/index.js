// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();

const db = cloud.database();
const MAX_LIMIT = 20;

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

function update(id, images) {
  return db.collection('views').doc(id).update({
    data: {
      images,
    },
  });
}

async function getImageFileId(url) {
  const {data} = await db
    .collection('images')
    .where({
      url,
    })
    .get();
  return data[0].fileId;
}
// 云函数入口函数
exports.main = async () => {
  const views = await getAllViews();
  const redViews = views.filter((d) => d.isRed);
  for (let v of redViews) {
    console.log('done')
    const {images} = v;
    const newImages = [];
    for (let [url] of images) {
      const fileId = await getImageFileId(url);
      newImages.push([url, fileId]);
    }
    await update(v._id, newImages);
  }
  console.log('end');
};
