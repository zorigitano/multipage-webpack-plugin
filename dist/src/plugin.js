"use strict";

var _keys = require("babel-runtime/core-js/object/keys");

var _keys2 = _interopRequireDefault(_keys);

var _slicedToArray2 = require("babel-runtime/helpers/slicedToArray");

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var webpack = require("webpack");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var TemplatedPathPlugin = require("webpack/lib/TemplatedPathPlugin");
var path = require("path");
var TEMPLATED_PATH_REGEXP_NAME = /\[name\]/gi;

function MultipageWebpackPlugin(pluginOptions) {
  pluginOptions = pluginOptions || {};

  this.sharedChunkName = pluginOptions.sharedChunkName || "shared";
  this.vendorChunkName = pluginOptions.vendorChunkName || "vendor";
  this.inlineChunkName = pluginOptions.inlineChunkName || "inline";

  this.templateFilename = pluginOptions.templateFilename || "index.html";
  this.templatePath = pluginOptions.templatePath || "templates/[name]";
}

module.exports = MultipageWebpackPlugin;

MultipageWebpackPlugin.prototype.getFullTemplatePath = function (entryKey) {
  var _map = [this.templatePath, this.templateFilename].map(function (path, pathIndex) {
    var appliedPath = path.replace(TEMPLATED_PATH_REGEXP_NAME, "" + entryKey);
    return appliedPath;
  }),
      _map2 = (0, _slicedToArray3.default)(_map, 2),
      appliedTemplatedPath = _map2[0],
      appliedTemplatedFilename = _map2[1];

  var fullTemplatePath = path.join(appliedTemplatedPath, appliedTemplatedFilename);

  console.log(fullTemplatePath);

  return fullTemplatePath;
};

MultipageWebpackPlugin.prototype.apply = function (compiler) {
  var _this = this;

  var webpackConfigOptions = compiler.options;

  var entriesToCreateTemplatesFor = (0, _keys2.default)(webpackConfigOptions.entry).filter(function (entry) {
    return entry !== _this.vendorChunkName;
  });

  entriesToCreateTemplatesFor.forEach(function (entryKey) {
    compiler.apply(new HtmlWebpackPlugin({
      filename: _this.getFullTemplatePath(entryKey),
      chunkSortMode: 'dependency',
      chunks: ['inline', _this.vendorChunkName, entryKey, _this.sharedChunkName]
    }));
  });

  compiler.apply(new webpack.optimize.CommonsChunkPlugin({
    name: "shared",
    minChunks: entriesToCreateTemplatesFor.length || 3,
    chunks: (0, _keys2.default)(webpackConfigOptions.entry)
  }), new webpack.optimize.CommonsChunkPlugin({
    name: "vendor",
    minChunks: Infinity,
    chunks: ["vendor"]
  }), new webpack.optimize.CommonsChunkPlugin({
    name: "inline",
    filename: "inline.chunk.js",
    minChunks: Infinity
  }));
};