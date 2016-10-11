const path = require('path');
const webpack = require('webpack');
const MultipageWebpackPlugin = require('../../src/plugin.js');

let config = {
  context: __dirname,
  entry: {
    a: './src/a/a.js',
    b: './src/b/b.js',
    c: './src/c/c.js'
  },
  output: {
    filename: '[name].chunk.js',
    path: path.join(__dirname,'./dist')
  },
  plugins: [
    new MultipageWebpackPlugin()
  ]
};

module.exports = config;