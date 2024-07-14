# 画家与骇客

Artworks are lofty, and data structures and algorithms are mysterious. The world is so vast. This time, let the painter and the hacker show you around!

![expample](./screenshots/example.png)

## Overview

"Painter and Hacker" provides users with an interesting service:

- First step, the user selects a landscape picture and a selfie. "Painter and Hacker" will use deep learning to extract the portrait from the selfie and paste it onto the selected landscape picture.
- Second step, the user can choose two filters to process the picture:
  - Painter: Transfer the style of some artworks to the composited picture through the method of style transfer.
  - Hacker: Process the composited picture during the visualization of some data structures and algorithms.
- Third step, provide corresponding articles to explain the selected artworks or algorithms.

The following picture simply explains this process.

![process](./screenshots/process.png)

"Painter and Hacker" provides users with two platforms to enjoy this interesting service: [Mini Program](./wx-miniprogram) and [Online Webpage](./web) (The online webpage is still under development).

![qrcode](./screenshots/qrcode.jpg)

## Implementation Method

- **Portrait Segmentation**: [Tensorflow.js/body-pix](https://github.com/tensorflow/tfjs-models/tree/master/body-pix) is used.
- **Style Transfer**:
  - Use the API provided by [DeepAi](https://deepai.org/machine-learning-model/fast-style-transfer).
  - For specific artworks supporting style transfer, please check [here](./sdk).
- **Data Structure and Algorithm Visualization**: First implement the data structure and algorithm, then test it. After successful testing, perform visualization. The implementation and introduction of specific data structures and algorithms can be found [here](./sdk).

## Existing Problems

- The effect of body-pix is not very ideal.
- The style-transfer process is too slow.

## Future Work

- Optimize the effect of portrait segmentation.
- Implement style transfer using tensorflow.js.
- More visualizations of data structures and algorithms.
- More introductions of artworks.
- Develop the web platform.