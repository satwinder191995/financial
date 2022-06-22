const webpack = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const path = require('path');

const config = {
  entry: {
    app: './public/js/index.js',
    idb:'./public/js/idb.js'
  },
  output: {
    path: path.join(__dirname + "/public/dist"),
    filename: "[name].bundle.js"
  },
  mode: 'production'
};

module.exports = config;
