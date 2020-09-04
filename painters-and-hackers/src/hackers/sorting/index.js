import * as d3 from 'd3-array';
import {map, getImageData} from '../utils/index';

export const configSetup = (sortMethod) => {
  return ({ctx, width, height}) => {
    const array = d3.shuffle(d3.range(40));
    const arrays = [array];
    const step = (a) => arrays.push(a);
    sortMethod(array, {step});

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);
    return arrays;
  };
};

export const update = ({frameCount, data}) => {
  if (frameCount >= data.length - 2) return true;
};

export const draw = ({ctx, width, height, imageData, data, frameCount}) => {
  const currentArrayIndex = frameCount + 1,
    preArrayIndex = frameCount,
    array = data[currentArrayIndex],
    preArray = data[preArrayIndex];

  const n = array.length,
    m = data.length,
    lineWidth = width / n,
    lineHeight = height / m;

  for (let i = 0; i < n; i++) {
    const current = array[i];
    const preIndex = preArray.indexOf(current);

    const x0 = map(preIndex, 0, n, 0, width) | 0;
    const y0 = map(preArrayIndex, 0, m, 0, height) | 0;
    const x = map(i, 0, n, 0, width) | 0;
    const y = map(currentArrayIndex, 0, m, 0, height) | 0;
    const index = currentArrayIndex * n + i;
    const [r, g, b] = getImageData(imageData, m, n, index);
    const v = map(current, 0, n - 1, 0.2, 1);

    ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${v})`;
    ctx.lineWidth = lineWidth * 0.7;
    ctx.lineCap = 'round';

    ctx.save();
    ctx.translate(lineWidth / 2, lineHeight / 2);
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.restore();
  }
};
