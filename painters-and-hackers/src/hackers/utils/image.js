function getImageData(imageData, cellRow, cellCol, i) {
  const x = (i) => ((i % cellCol) * (imageData.width / cellCol)) | 0;
  const y = (i) => (((i / cellCol) | 0) * (imageData.height / cellRow)) | 0;
  const index = (y(i) * imageData.width + x(i)) * 4;
  return [
    imageData.data[index],
    imageData.data[index + 1],
    imageData.data[index + 2],
    imageData.data[index + 3],
  ];
}

function colorArray() {
  const grey = ([r, g, b, a]) => {
    const v = r * 0.299 + g * 0.587 + b * 0.114;
    return `rgba(${v}, ${v}, ${v}, ${a})`;
  };
  const red = (color) => `rgba(${color[0]}, ${0}, ${0}, ${color[3]})`;
  const pink = (color) => `rgba(${color[0]}, ${0}, ${color[1]}, ${color[3]})`;
  const blue = (color) => `rgba(${0}, ${0}, ${color[2]}, ${color[3]})`;
  const cyan = (color) => `rgba(${0}, ${color[1]}, ${color[1]}, ${color[3]})`;
  const green = (color) => `rgba(${0}, ${color[1]}, ${0}, ${color[3]})`;
  const yellow = (color) => `rgba(${color[0]}, ${color[1]}, ${0}, ${color[3]})`;

  const origin = ([r, g, b, a]) => `rgba(${r}, ${g}, ${b}, ${a})`;
  return [grey, red, pink, blue, cyan, green, yellow, origin];
}

export {getImageData, colorArray};
