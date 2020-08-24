import * as tf from '@tensorflow/tfjs-core';
import * as bodyPix from '@tensorflow-models/body-pix';

const BODYPIX_URL = 'https://ai.flypot.cn/models/body-pix/model.json';

export default class Classifier {
  constructor() {
    this.ready = false;
    this.shouldDetect = false;
  }

  load = () => {
    return bodyPix
      .load({
        modelUrl: BODYPIX_URL,
        // modelUrl:"https://storage.googleapis.com/tfjs-models/savedmodel/bodypix/mobilenet/quant2/100/model-stride16.json",
      })
      .then((model) => {
        this.model = model;
        this.ready = true;
      });
  };

  detectBodySegmentation(frame) {
    this.imageData = frame.data;
    const tensor = tf.tidy(() => {
      const temp = tf.tensor(new Uint8Array(frame.data), [
        frame.height,
        frame.width ,
        4,
      ]);
      const sliceOptions = {
        start: [0, 0, 0],
        size: [-1, -1, 3],
      };
      return temp.slice(sliceOptions.start, sliceOptions.size);
    });

    const segmentation = this.model.segmentPerson(tensor, {
      flipHorizontal: false,
      internalResolution: 'medium',
      segmentationThreshold: 0.7,
    });

    return segmentation;
  }

  toMaskImageData(segmentation, background) {
    const {width, height, data} = segmentation;
    const {data: backgroundData} = background;
    const bytes = new Uint8ClampedArray(width * height * 4);

    for (let i = 0; i < height * width; ++i) {
      const shouldMask = data[i];
      const j = i * 4;
      if (shouldMask) {
        bytes[j + 0] = this.imageData[j + 0];
        bytes[j + 1] = this.imageData[j + 1];
        bytes[j + 2] = this.imageData[j + 2];
        bytes[j + 3] = this.imageData[j + 3];
      } else {
        bytes[j + 0] = backgroundData[j + 0];
        bytes[j + 1] = backgroundData[j + 1];
        bytes[j + 2] = backgroundData[j + 2];
        bytes[j + 3] = backgroundData[j + 3];
      }
    }

    return {data: bytes, width, height};
  }

  dispose() {
    this.model.dispose();
  }
}
