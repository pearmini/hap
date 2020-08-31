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

export {getImageData};
