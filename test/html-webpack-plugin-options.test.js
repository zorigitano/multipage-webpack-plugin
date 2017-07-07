import * as path from 'path';
import Promise from 'bluebird';
import test from 'ava';
import {
  runWebpackCompilerMemoryFs, 
  getEntryKeysFromStats,  
  testFs
} from './utils.js';

const simpleConfig = require('../examples/html-webpack-plugin-options/webpack.config.js');
const fs = testFs; // Use shared memoryfs instance

const simpleExamplePath = path.resolve(__dirname, '../examples/html-webpack-plugin-options');
const webpackBuildPath = path.resolve(simpleExamplePath, './dist');

// Convienence to use async await with these common fs functions
const readdir = Promise.promisify(fs.readdir, {context: fs});
const readFile = Promise.promisify(fs.readFile, {context: fs});
const fsReaddir = Promise.promisify(fs.readdir, {context: fs});
const fsReadFile = Promise.promisify(fs.readFile, {context: fs});
const fsStat = Promise.promisify(fs.stat, {context: fs});
const fsExists = Promise.promisify(fs.exists, {context: fs});


let webpackBuildStats = null;

test.before('run webpack build first', async t => {
  webpackBuildStats = await runWebpackCompilerMemoryFs(simpleConfig);
});

// Run
test('it should run successfully', async t => {
  let {stats, warnings, errors} = webpackBuildStats;

  t.falsy(stats.hasWarnings() && errors.hasWarnings());
});

// Test some htmlWebpackPlugin options
test('each template should use options of htmlWebpackPlugin correctly', async t => {
  const stats = webpackBuildStats.stats;
  let entries = await getEntryKeysFromStats(stats);

  // test minify option
  let allTemplatesMinified = true;
  // test favicon option
  let faviconAdded = true;

  for(let entryName of entries) {
    let templateContent = await readFile(path.join(webpackBuildPath, "templates", entryName, "index.html"));
    templateContent = templateContent.toString();

    // whitespaces between tags have been collapsed
    if (/>\s</.test(templateContent)) {
      allTemplatesMinified = false;
      break;
    }

    // favicon has been added
    if (!/\<link rel=\"shortcut icon\" href=favicon\.ico\>/.test(templateContent)) {
      faviconAdded = false;
      break;
    }
  }

  t.true(allTemplatesMinified);
  t.true(faviconAdded);
});