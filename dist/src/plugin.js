"use strict";

var _keys = require("babel-runtime/core-js/object/keys");

var _keys2 = _interopRequireDefault(_keys);

var _slicedToArray2 = require("babel-runtime/helpers/slicedToArray");

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _assign = require("babel-runtime/core-js/object/assign");

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var webpack = require("webpack");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var TemplatedPathPlugin = require("webpack/lib/TemplatedPathPlugin");
var path = require("path");
var TEMPLATED_PATH_REGEXP_NAME = /\[name\]/gi;

function setPluginOptions(pluginOptions) {
  var sharedChunkName = pluginOptions.sharedChunkName,
      vendorChunkName = pluginOptions.vendorChunkName,
      inlineChunkName = pluginOptions.inlineChunkName,
      templateFilename = pluginOptions.templateFilename,
      templatePath = pluginOptions.templatePath;


  return {
    sharedChunkName: sharedChunkName || 'shared',
    vendorChunkName: vendorChunkName || 'vendor',
    inlineChunkName: inlineChunkName || 'inline',
    templateFilename: templateFilename || 'index.html',
    templatePath: templatePath || 'templates/[name]'
  };
}

module.exports = function () {
  function _class() {
    var pluginOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, _class);

    (0, _assign2.default)(this, setPluginOptions(pluginOptions));
  }

  (0, _createClass3.default)(_class, [{
    key: "getFullTemplatePath",
    value: function getFullTemplatePath(entryKey) {
      var _map = [this.templatePath, this.templateFilename].map(function (pathStr) {
        return pathStr.replace(TEMPLATED_PATH_REGEXP_NAME, "" + entryKey);
      }),
          _map2 = (0, _slicedToArray3.default)(_map, 2),
          appliedTemplatedPath = _map2[0],
          appliedTemplatedFilename = _map2[1];

      return path.join(appliedTemplatedPath, appliedTemplatedFilename);
    }
  }, {
    key: "apply",
    value: function apply(compiler) {
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
    }
  }]);
  return _class;
}();