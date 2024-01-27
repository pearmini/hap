import * as cm from "@charming-art/charming";

export function scaleImageColor(domain, range) {
  const [width, height] = domain;
  const { data, width: imageWidth, height: imageHeight } = range;
  const scaleX = cm.scaleLinear([0, width], [0, imageWidth - 1]);
  const scaleY = cm.scaleLinear([0, height], [0, imageHeight - 1]);
  return (x, y) => {
    const x1 = Math.round(scaleX(x));
    const y1 = Math.round(scaleY(y));
    const i = x1 + y1 * imageWidth;
    const r = data[i * 4];
    const g = data[i * 4 + 1];
    const b = data[i * 4 + 2];
    const a = data[i * 4 + 3];
    return `rgba(${r}, ${g}, ${b}, ${a/255})`;
  };
}
