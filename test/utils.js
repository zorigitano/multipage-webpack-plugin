var MemoryFS = require('memory-fs');
var Promise = require('bluebird');
var webpack = require('webpack');
var rimraf = require('rimraf');

var fs = require('fs');
var path = require('path');

exports.runWebpackCompilerMemoryFs = function runWebpackCompiler(config, options) {
  const compiler = webpack(config);

  // Set the compiler output fs to be memoryFS, 
  // This way we aren't outputting to file 1034234 times
  // which is slow as hell

  const outputfs = compiler.outputFileSystem = new MemoryFS();
  const readdir = Promise.promisify(outputfs.readdir, {context: outputfs});
  const readFile = Promise.promisify(outputfs.readFile, {context: outputfs});
  const stat = Promise.promisify(outputfs.stat, {context: outputfs});
  const fsReaddir = Promise.promisify(fs.readdir, {context: fs});
  const fsReadFile = Promise.promisify(fs.readFile, {context: fs});
  const fsStat = Promise.promisify(fs.stat, {context: fs});
  const run = Promise.promisify(compiler.run, {context: compiler});

  return run()
    .then(function(stats) {
      let { compilation } = stats,
          { errors, warnings, assets, entrypoints } = compilation;

      let statsJson = stats.toJson();

      return {
        assets,
        entrypoints,
        errors,
        warnings,
        stats,
        statsJson
      };
    });
};