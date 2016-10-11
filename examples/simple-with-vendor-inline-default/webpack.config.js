const path = require('path');
const MultipageWebpackPlugin = require('../../src/plugin.js');
const webpack = require('webpack');

let config = {
  context: __dirname,
  entry: {
    a: './src/a/a.js',
    b: './src/b/b.js', 
    c: './src/c/c.js',
    vendor: ['lodash']
  },
  output: {
    filename: '[name].chunk.js',
    path: path.resolve(__dirname,'./dist')
  },
  plugins: [
    new MultipageWebpackPlugin()
  ]
};

module.exports = config;