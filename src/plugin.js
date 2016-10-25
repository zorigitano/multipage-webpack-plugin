const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");


function MultipageWebpackPlugin(pluginOptions) { 
  pluginOptions = pluginOptions || {};

  this.vendorChunkName = pluginOptions.vendorChunkName || "vendor";
  this.inlineChunkName = pluginOptions.inlineChunkName || "inline";
  this.sharedChunkName = pluginOptions.sharedChunkName || "shared";
}

module.exports = MultipageWebpackPlugin;

MultipageWebpackPlugin.prototype.apply = function(compiler) {
  let webpackConfigOptions = compiler.options;

  let entriesToCreateTemplatesFor = Object.keys(webpackConfigOptions.entry).filter(entry => {
    return entry !== this.vendorChunkName;
  });

  console.log(entriesToCreateTemplatesFor);

  entriesToCreateTemplatesFor.forEach( entryKey => {
    compiler.apply(
      new HtmlWebpackPlugin({
        filename: `./templates/${entryKey}/index.html`,
        chunkSortMode: 'dependency',
        chunks: [
          'inline', 
          this.vendorChunkName, 
          entryKey, 
          this.sharedChunkName
        ]
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
      minChunks: this.vendorChunkName ? (module) => {return module.resource.test(/node_modules/)} : Infinity,
      chunks: ["vendor"]
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: "inline",
      filename: "inline.chunk.js",
      minChunks: Infinity
    })
  );

};