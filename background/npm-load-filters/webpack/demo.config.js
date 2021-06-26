const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');


const validTargets = ['background']

const target = process.env.TARGET ? (validTargets.indexOf(process.env.TARGET) > -1 ? process.env.TARGET : validTargets[0]) : validTargets[0]

module.exports = {
  entry: [`./src/${target}/demo.js`],
  output: {
    libraryTarget: "window",
    path: path.resolve(__dirname, `../demo/${target}`),
    // chunkFilename: `${target}.demo.js`,
    filename: `${target}.demo.js`,
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        },
      },
    ]
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanStaleWebpackAssets: false
    }),
    new HtmlWebpackPlugin({
        template: `src/${target}/index.html`,
        inject: 'head',
        scriptLoading: 'blocking',
        filename: process.env.HTML_FNAME || 'index.html',
    }),
  ],
  devServer: {
    injectClient: false, // Fixes import issue as per https://github.com/webpack/webpack-dev-server/issues/2484#issuecomment-655211893
    // port: 8008
},
  node: {}
};
