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
  const initalCnt = 400;
  const vector = new Vector(initalCnt);

  // 设置 actions
  const actions = [
    () => {
      const {data, width, height} = imageData;
      for (let i = 0; i < initalCnt; i++) {
        const x = ((i % cellCol) * (width / cellCol)) | 0;
        const y = (((i / cellCol) | 0) * (height / cellRow)) | 0;
        const index = (y * width + x) * 4;
        vector.append([
          data[index],
          data[index + 1],
          data[index + 2],
          data[index + 3],
        ]);
      }
    },
    () => {
      vector.remove(10);
    },
    () => {
      vector.remove(20);
    }
  ];

  let index = 0;
  draw();
  const timer = setInterval(() => {
    if (index >= actions.length) {
      clearInterval(timer);
      cb();
      return;
    }
    draw();
  }, 1000);

  function draw() {
    console.log('draw')
    drawBackgournd();
    actions[index]();
    drawVector();
    index++;
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
      ctx.strokeStyle = '#aaa';
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
}
