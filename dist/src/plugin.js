"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
      templatePath = pluginOptions.templatePath,
      htmlTemplatePath = pluginOptions.htmlTemplatePath;


  return {
    sharedChunkName: sharedChunkName || 'shared',
    vendorChunkName: vendorChunkName || 'vendor',
    inlineChunkName: inlineChunkName || 'inline',
    templateFilename: templateFilename || 'index.html',
    templatePath: templatePath || 'templates/[name]',
    htmlTemplatePath: htmlTemplatePath || undefined
  };
}

var MultipageWebpackPlugin = function () {
  function MultipageWebpackPlugin() {
    var pluginOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, MultipageWebpackPlugin);

    Object.assign(this, setPluginOptions(pluginOptions));
  }

  _createClass(MultipageWebpackPlugin, [{
    key: "getFullTemplatePath",
    value: function getFullTemplatePath(entryKey) {
      var _map = [this.templatePath, this.templateFilename].map(function (pathStr) {
        return pathStr.replace(TEMPLATED_PATH_REGEXP_NAME, "" + entryKey);
      }),
          _map2 = _slicedToArray(_map, 2),
          appliedTemplatedPath = _map2[0],
          appliedTemplatedFilename = _map2[1];

      return path.join(appliedTemplatedPath, appliedTemplatedFilename);
    }
  }, {
    key: "apply",
    value: function apply(compiler) {
      var _this = this;

      console.error("HTML TEMPLATE PATH", this.htmlTemplatePath);

      var webpackConfigOptions = compiler.options;

      var entriesToCreateTemplatesFor = Object.keys(webpackConfigOptions.entry).filter(function (entry) {
        return entry !== _this.vendorChunkName;
      });

      entriesToCreateTemplatesFor.forEach(function (entryKey) {
        var htmlWebpackPluginOptions = {
          filename: _this.getFullTemplatePath(entryKey),
          chunkSortMode: 'dependency',
          chunks: ['inline', _this.vendorChunkName, entryKey, _this.sharedChunkName]
        };

        if (typeof _this.htmlTemplatePath !== "undefined") {
          htmlWebpackPluginOptions.template = _this.htmlTemplatePath;
        }

        compiler.apply(new HtmlWebpackPlugin(htmlWebpackPluginOptions));
      });

      compiler.apply(new webpack.optimize.CommonsChunkPlugin({
        name: "shared",
        minChunks: entriesToCreateTemplatesFor.length || 3,
        chunks: Object.keys(webpackConfigOptions.entry)
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

  return MultipageWebpackPlugin;
}();

module.exports = MultipageWebpackPlugin;
