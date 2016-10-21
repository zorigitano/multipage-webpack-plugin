const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");


function MultipageWebpackPlugin(pluginOptions) {
  this.pluginOptions = {} || {
    sharedChunkName: "shared",
    vendorChunkName: "vendor",
    inlineChunkName: "inline"
  }
}

module.exports = MultipageWebpackPlugin;

MultipageWebpackPlugin.prototype.apply = function(compiler) {
  let webpackConfigOptions = compiler.options;

  let entriesToCreateTemplatesFor = Object.keys(webpackConfigOptions.entry).filter(entry => {
    return entry !== this.pluginOptions.vendorChunkName;
  });

  entriesToCreateTemplatesFor.forEach( entryKey => {
    compiler.apply(
      new HtmlWebpackPlugin({
        filename: `./templates/${entryKey}/index.html`,
        chunkSortMode: 'dependency',
        chunks: ['inline', this.pluginOptions.vendorChunkName, entryKey, this.pluginOptions.sharedChunkName]
      })
    );
  });

  compiler.apply(
    new webpack.optimize.CommonsChunkPlugin({
      name: "shared",
      minChunks: 2,
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