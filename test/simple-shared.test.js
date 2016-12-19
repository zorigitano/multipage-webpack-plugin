import * as path from 'path';
import Promise from 'bluebird';
import test from 'ava';
import {
  runWebpackCompilerMemoryFs, 
  getEntryKeysFromStats,  
  testFs
} from './utils.js';


const fs = testFs; // Use shared memoryfs instance
const webpackConfig = require("../examples/simple-with-vendor-shared-default/webpack.config.js");
const simpleExamplePath = path.resolve(__dirname, "../examples/simple-with-vendor-shared-default");
const webpackBuildPath = path.resolve(simpleExamplePath, './dist');

// Convienence to use async await with these common fs functions
const readdir = Promise.promisify(fs.readdir, {context: fs});
const readFile = Promise.promisify(fs.readFile, {context: fs});
const fsReaddir = Promise.promisify(fs.readdir, {context: fs});
const fsReadFile = Promise.promisify(fs.readFile, {context: fs});
const fsStat = Promise.promisify(fs.stat, {context: fs});
const fsExists = Promise.promisify(fs.exists, {context: fs});

////////////////////
//                //
// Tests Run Here //
//                //
////////////////////

let webpackBuildStats = null;

test.before('run webpack build first', async t => {
  webpackBuildStats = await runWebpackCompilerMemoryFs(webpackConfig);
});

test('it should run successfully', async t => {
  let {stats, warnings, errors} = webpackBuildStats;

  t.falsy(stats.hasWarnings() && stats.hasErrors());
});

test('it should extract modules used in multiple entrypoints into a separate chunk', async t => {
  let {stats, warnings, errors} = webpackBuildStats;

  let chunkStats = stats.compilation.chunks
    .map(chunk => {
      return {
        name: chunk.name,
        id: chunk.id,
        modules: chunk.modules.map(module => {return module.id})
      };
    });

  let sharedChunkModules = new Set(chunkStats.find((chunkStatObject) => {return chunkStatObject.name === "shared"}).modules);

  function uniqueModuleInEachChunk() {
    return chunkStats
      .filter(chunk => chunk.name != "shared")
      .every(chunk => chunk.modules
        .every(moduleId => !sharedChunkModules.has(moduleId))
      );
  }

  t.true(uniqueModuleInEachChunk(), 'each module in each chunk is unique');
});

test('it should emit shared chunk into default output path', async t => {
  let {stats, warnings, errors} = webpackBuildStats;
  let dirStats = await fsStat(path.join(webpackBuildPath, "shared.chunk.js"));

  t.truthy(dirStats);
});

test('should not create template for shared chunk', async t => {
  let directoryContents = await fsReaddir(path.join(webpackBuildPath, "templates"));

  t.truthy(directoryContents.indexOf("shared"));
});
