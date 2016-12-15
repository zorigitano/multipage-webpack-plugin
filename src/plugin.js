const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TemplatedPathPlugin = require("webpack/lib/TemplatedPathPlugin");
const path = require("path");
const TEMPLATED_PATH_REGEXP_NAME = /\[name\]/gi;

function MultipageWebpackPlugin(pluginOptions) {
  pluginOptions = pluginOptions || {};

  this.sharedChunkName = pluginOptions.sharedChunkName || "shared";
  this.vendorChunkName = pluginOptions.vendorChunkName || "vendor";
  this.inlineChunkName = pluginOptions.inlineChunkName || "inline";

  this.templateFilename = pluginOptions.templateFilename || "index.html";
  this.templatePath = pluginOptions.templatePath || "templates/[name]";
}

module.exports = MultipageWebpackPlugin;

MultipageWebpackPlugin.prototype.getFullTemplatePath = function(entryKey) {
  let [appliedTemplatedPath, appliedTemplatedFilename] = [this.templatePath, this.templateFilename].map((path, pathIndex) => {
    const appliedPath = path.replace(TEMPLATED_PATH_REGEXP_NAME, `${entryKey}`);
    return appliedPath;
  });

  let fullTemplatePath = path.join(appliedTemplatedPath, appliedTemplatedFilename);

  console.log(fullTemplatePath);

  return fullTemplatePath;
};

MultipageWebpackPlugin.prototype.apply = function(compiler) {
  let webpackConfigOptions = compiler.options;

  let entriesToCreateTemplatesFor = Object.keys(webpackConfigOptions.entry).filter(entry => {
    return entry !== this.vendorChunkName;
  });

  entriesToCreateTemplatesFor.forEach( entryKey => {
    compiler.apply(
      new HtmlWebpackPlugin({
        filename: this.getFullTemplatePath(entryKey),
        chunkSortMode: 'dependency',
        chunks: ['inline', this.vendorChunkName, entryKey, this.sharedChunkName]
      })
    );
  });

  compiler.apply(
    new webpack.optimize.CommonsChunkPlugin({
      name: "shared",
      minChunks: entriesToCreateTemplatesFor.length || 3,
      chunks: Object.keys(webpackConfigOptions.entry)
    }),      
    new webpack.optimize.CommonsChunkPlugin({
      name: "vendor",
      minChunks: Infinity,
      chunks: ["vendor"]
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: "inline",
      filename: "inline.chunk.js",
      minChunks: Infinity
    })
  );
};
