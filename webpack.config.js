const path = require('path')

module.exports = {
  context: path.resolve(__dirname),
  entry: {
    server: './server/main.js'
  },
  devtool: 'source-map',
  module: {
    rules: [{
      //   test: /\.css$/,
      //   use: [
      //     {loader: 'style-loader'},
      //     {loader: 'css-loader'}
      //   ]
      // },
      // {
      test: /\.js$/,
      exclude: /node_modules/,
      use: [{
        loader: 'babel-loader',
        options: {presets: ['es2017', 'stage-2']}
      }]
    }]
  },
  output: {
    path: path.resolve(__dirname, './dist/server'),
    filename: '[name].bundle.js'
  }
}
