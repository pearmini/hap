// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();

const db = cloud.database();
const MAX_LIMIT = 100;

async function getAllViews() {
  const countResult = await db.collection('views').count();
  const total = countResult.total;
  const batchTimes = Math.ceil(total / 100);
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

async function upload(filePath) {
  
}

async function update(id, newImages) {
  return db
    .collection('views')
    .doc(id)
    .update({
      data: {
        images: newImages,
      },
    });
}

// 云函数入口函数
exports.main = async (event, context) => {
  const views = await getAllViews();
  const redViews = views.filter((d) => d.isRed).slice(0, 1);
  console.log(redViews);
  // for (let v of redViews) {
  //   const {images} = v;
  //   const newImages = [];
  //   for (let [url] of images) {
  //     const name = url.split('/')[0];
  //     const filePath = `red_views/${name}`;
  //     const fileID = await upload(filePath);
  //     newImages.push([url, fileID]);
  //   }
  //   // await update(v._id, newImages);
  // }
};
