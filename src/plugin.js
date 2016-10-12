const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");


function MultipageWebpackPlugin(pluginOptions) {
  this.pluginOptions = pluginOptions || {
    sharedChunkName: "shared",
    vendorChunkName: "vendor"
  };
};

module.exports = MultipageWebpackPlugin;

MultipageWebpackPlugin.prototype.apply = function(compiler) {
  let webpackConfigOptions = compiler.options;

  let entriesToCreateTemplatesFor = Object.keys(webpackConfigOptions.entry).filter(entry => {
    return entry !== this.pluginOptions.vendorChunkName;
  });

  entriesToCreateTemplatesFor.forEach( entryKey => {
    compiler.apply(
      new HtmlWebpackPlugin({
        filename: `./templates/${entryKey}/template.html`,
        chunkSortMode: 'dependency',
        chunks: ['inline', this.pluginOptions.vendorChunkName, entryKey, this.pluginOptions.sharedChunkName]
      })
    );
  });

  compiler.apply(
    new webpack.optimize.CommonsChunkPlugin({
      name: `${this.pluginOptions.sharedChunkName}`,
      filename: `${this.pluginOptions.sharedChunkName}.bundle.js`,
      minChunks: 2,
      chunks: Object.keys(webpackConfigOptions.entry)
    }),      
    new webpack.optimize.CommonsChunkPlugin({
      name: "vendors",
      minChunks: Infinity
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: "inline",
      filename: "inline.chunk.js",
      minChunks: Infinity
    })
  );


};