import * as d3 from "d3";

export function scaleImageColor(imageData, [width, height]) {
  const {data, width: imageWidth, height: imageHeight} = imageData;
  const scaleX = d3.scaleLinear([0, width], [0, imageWidth]);
  const scaleY = d3.scaleLinear([0, height], [0, imageHeight]);
  return ([x0, y0]) => {
    const x = Math.round(scaleX(x0));
    const y = Math.round(scaleY(y0));
    const i = x + y * imageWidth;
    const r = data[i * 4];
    const g = data[i * 4 + 1];
    const b = data[i * 4 + 2];
    const a = data[i * 4 + 3];
    return [r, g, b, a];
  };
}
