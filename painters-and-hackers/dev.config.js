module.exports = {
  src: './dist/painters-and-hackers.min.js',
  dist: [
    {
      name: '小程序',
      filePath: '../wx-miniprogram/client/lib/painters-and-hackers.js',
    },
    {
      name: '网页',
      filePath: '../web/painters-and-hackers.js',
    },
  ],
};
