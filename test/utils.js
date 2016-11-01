const MemoryFS = require("memory-fs");
const Promise = require("bluebird");
const webpack = require("webpack");

const outputfs = new MemoryFS();

exports.runWebpackCompilerMemoryFs = function runWebpackCompiler(config) {
  const compiler = webpack(config);

  // Set the compiler output fs to be memoryFS,
  // This way we aren't outputting to file 1034234 times
  // which is slow as hell

  compiler.outputFileSystem = outputfs;
  const run = Promise.promisify(compiler.run, { context: compiler });

  return run()
    .then((stats) => {
      const { compilation } = stats;
      const { errors, warnings, assets, entrypoints } = compilation;

      const statsJson = stats.toJson();

      return {
        assets,
        entrypoints,
        errors,
        warnings,
        stats,
        statsJson,
      };
    });
};

exports.getEntryKeysFromStats = function getEntryKeysFromStatsFn(statsObject) {
  let entryKeys = null;

  if (
    statsObject &&
    statsObject.compilation &&
    statsObject.compilation.options &&
    statsObject.compilation.options.entry
  ) {
    entryKeys = Object.keys(statsObject.compilation.options.entry);
  }

  return entryKeys;
};

exports.testFs = outputfs;
