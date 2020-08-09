module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'painters-and-hackers.js',
    path: __dirname + '/dist',
    libraryTarget: 'umd',
    globalObject: 'this',
    library: 'ph',
    libraryExport: 'default',
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
};
