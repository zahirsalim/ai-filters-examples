const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');



module.exports = {
  entry: ["./src/core/main.js"],
  output: {
    library: "test",
    libraryTarget: "umd",
    libraryExport: "default",
    path: path.resolve(__dirname, '../demo/core'),
      chunkFilename: 'test.[name].js',
    filename: "test.js"
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
        template: './src/core/index.html',
        inject: true,
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
