const HtmlWebpackPlugin = require("html-webpack-plugin");

function MultipageWebpackPlugin(pluginOptions) {
  this.pluginOptions = pluginOptions;
};

module.exports = MultipageWebpackPlugin;

MultipageWebpackPlugin.prototype.apply = function(compiler) {
  let webpackConfigOptions = compiler.options;

  Object.keys(webpackConfigOptions.entry).forEach( entryKey => {
    compiler.apply(new HtmlWebpackPlugin(
      {
        filename: `./templates/${entryKey}/template.html`,
        chunks: [entryKey]
      }
    ));
  });
};