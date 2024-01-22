import ColorThief from "colorthief";

function context2d(width, height, dpr = null) {
  if (dpr == null) dpr = devicePixelRatio;
  const canvas = document.createElement("canvas");
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = width + "px";
  canvas.style.height = height + "px";
  const context = canvas.getContext("2d");
  context.scale(dpr, dpr);
  return context;
}

export function loadImage(src) {
  const image = new Image();
  image.src = src;
  return new Promise((resolve, reject) => {
    image.onload = () => resolve(image);
    image.onerror = reject;
  });
}

export function getImageData(image, width, height) {
  const context = context2d(width, height, 1);
  context.drawImage(image, 0, 0, width, height);
  return context.getImageData(0, 0, width, height).data;
}

export function getImageColor(image) {
  const colorThief = new ColorThief();
  const [r, g, b] = colorThief.getColor(image);
  return `rgb(${r}, ${g}, ${b})`;
}
