export default function (width, height, cnt) {
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
  return {
    cellCol,
    cellRow,
    cellWidth,
    cellHeight,
  };
}
