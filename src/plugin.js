const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TemplatedPathPlugin = require("webpack/lib/TemplatedPathPlugin");
const path = require("path");
const TEMPLATED_PATH_REGEXP_NAME = /\[name\]/gi;

function setPluginOptions (pluginOptions) {
  const {
    sharedChunkName,
    vendorChunkName,
    inlineChunkName,
    templateFilename,
    templatePath,
    htmlTemplatePath,
  } = pluginOptions

  return {
    sharedChunkName: sharedChunkName || 'shared',
    vendorChunkName: vendorChunkName || 'vendor',
    inlineChunkName: inlineChunkName || 'inline',
    templateFilename: templateFilename || 'index.html',
    templatePath: templatePath || 'templates/[name]',
    htmlTemplatePath: htmlTemplatePath || undefined
  };
}

class MultipageWebpackPlugin {
  constructor (pluginOptions = {}) {
    Object.assign(this, setPluginOptions(pluginOptions))
  }
  
  getFullTemplatePath (entryKey) {
    let [appliedTemplatedPath, appliedTemplatedFilename] = [this.templatePath,this.templateFilename]
      .map(pathStr => pathStr.replace(TEMPLATED_PATH_REGEXP_NAME, `${entryKey}`));

    return path.join(appliedTemplatedPath, appliedTemplatedFilename);
  }

  apply (compiler) {
    console.error("HTML TEMPLATE PATH", this.htmlTemplatePath);
    
    let {options: webpackConfigOptions} = compiler;
    let entriesToCreateTemplatesFor = Object
      .keys(webpackConfigOptions.entry)
      .filter(entry => entry !== this.vendorChunkName);
      

    entriesToCreateTemplatesFor.forEach((entryKey) => {
      let htmlWebpackPluginOptions = {
        filename: this.getFullTemplatePath(entryKey),
        chunkSortMode: 'dependency',
        chunks: ['inline', this.vendorChunkName, entryKey, this.sharedChunkName]
      };

      if (typeof this.htmlTemplatePath !== "undefined") {
        htmlWebpackPluginOptions.template = this.htmlTemplatePath;
      }

      compiler.apply(
        new HtmlWebpackPlugin(htmlWebpackPluginOptions)
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
  }
}
module.exports = MultipageWebpackPlugin;
