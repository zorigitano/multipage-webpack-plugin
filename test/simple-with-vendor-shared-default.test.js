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
  webpackConfig.performance = {
    hints: false
  };
  webpackBuildStats = await runWebpackCompilerMemoryFs(webpackConfig);
});

test('it should run successfully', async t => {
  let {stats, warnings, errors} = webpackBuildStats;

  t.falsy(stats.hasWarnings() && stats.hasErrors());
});
