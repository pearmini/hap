import Vector from './Vector';

export default function ({ctx, imageData, width, height, cb}) {
  // 设置最合适的大小
  const cnt = 20;
  let cellHeight, cellWidth, cellRow, cellCol;

  if (width > height) {
    cellHeight = height / cnt;
    cellRow = cnt;
    cellCol = Math.ceil(width / height) * cellRow;
    cellWidth = width / cellCol;
  } else {
    cellWidth = width / cnt;
    cellCol = cnt;
    cellRow = (height / width) * cellCol;
    cellHeight = height / cellRow;
  }

  // 初始化数组
  const vector = new Vector();
  const x = (i) => ((i % cellCol) * (imageData.width / cellCol)) | 0;
  const y = (i) => (((i / cellCol) | 0) * (imageData.height / cellRow)) | 0;
  const getImageData = (i) => {
    const index = (y(i) * imageData.width + x(i)) * 4;
    return [
      imageData.data[index],
      imageData.data[index + 1],
      imageData.data[index + 2],
      imageData.data[index + 3],
    ];
  };

  // 设置 actions
  const actions = getActions();
  console.log(actions.length);
  let frameCount = 0;
  const speed = 100;

  draw();

  const timer = setInterval(() => {
    ++frameCount;
    if (frameCount >= actions.length) {
      cb();
      clearInterval(timer);
      return;
    }
    draw();
  }, speed);

  function draw() {
    drawBackgournd();
    actions[frameCount]();
    drawVector();
  }

  function drawBackgournd() {
    // 绘制所有格子
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, width, height);
    for (let i = 0; i < cellCol; i++) {
      for (let j = 0; j < cellRow; j++) {
        ctx.strokeStyle = '#eee';
        ctx.strokeRect(i * cellWidth, j * cellHeight, cellWidth, cellHeight);
      }
    }
  }

  function drawVector() {
    // 绘制数组容量
    for (let i = 0; i < vector._capacity; i++) {
      const x = i % cellCol;
      const y = (i / cellCol) | 0;
      ctx.strokeStyle = '#000';
      ctx.strokeRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
    }

    // 绘制数组元素
    for (let i = 0; i < vector.size(); i++) {
      const x = i % cellCol;
      const y = (i / cellCol) | 0;
      const [r, g, b, a] = vector.get(i);
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
      ctx.fillRect(
        x * cellWidth + 1,
        y * cellHeight + 1,
        cellWidth - 2,
        cellHeight - 2
      );
    }
  }

  function getActions() {
    const totalCnt = cellRow * cellCol;
    let currentCnt = 0;
    const actions = [];

    while (currentCnt < totalCnt) {
      // 在后面加入
      const potentialCnt = Math.random() * 30;
      const appendCnt = Math.min(totalCnt - vector.size(), potentialCnt);
      currentCnt += appendCnt;
      const appendToVector = () => {
        const size = vector.size();
        for (let i = 0; i < appendCnt; i++) {
          vector.append(getImageData(size + i));
        }
      };
      actions.push(appendToVector);

      // // 删除
      // const deleteArray = [];
      // const size = vector.size();

      // // 插入
      // const insertToVector = () => {};
    }
    return actions;
  }
}
