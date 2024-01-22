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

export function loadImageData(image, width, height) {
  const context = context2d(width, height, 1);
  context.drawImage(image, 0, 0, width, height);
  return getImageData(context, width, height);
}

export function getImageData(context, width, height) {
  const imageData = context.getImageData(0, 0, width, height).data;
  return imageData;
}
