const path = require('path');
const webpack = require('webpack');
const MultipageWebpackPlugin = require('../../src/plugin.js');

function resolve(dir) {
  return path.join(__dirname, dir);
}

let config = {
  context: __dirname,
  entry: {
    a: './src/a/a.js',
    b: './src/b/b.js',
    c: './src/c/c.js'
  },
  output: {
    filename: '[name].chunk.js',
    path: resolve('./dist')
  },
  plugins: [
    new MultipageWebpackPlugin({
      // replace [name] in template path
      htmlTemplatePath: resolve('./html-templates/[name].html'),
      // some other options in htmlWebpackPlugin
      htmlWebpackPluginOptions: {
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true
        },
        favicon: resolve('./static/favicon.ico')
      }
    })
  ]
};

module.exports = config;