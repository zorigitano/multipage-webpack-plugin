import * as path from 'path';
import Promise from 'bluebird';
import test from 'ava';
import MultipageWebpackPlugin from '../src/plugin';
import {
  runWebpackCompilerMemoryFs, 
  getEntryKeysFromStats,  
  testFs
} from './utils.js';

const simpleConfig = require('../examples/simple/webpack.config.js');
const fs = testFs; // Use shared memoryfs instance

const simpleExamplePath = path.resolve(__dirname, '../examples/simple');
const webpackBuildPath = path.resolve(simpleExamplePath, './dist');

// Convienence to use async await with these common fs functions
const readdir = Promise.promisify(fs.readdir, {context: fs});
const readFile = Promise.promisify(fs.readFile, {context: fs});
const fsReaddir = Promise.promisify(fs.readdir, {context: fs});
const fsReadFile = Promise.promisify(fs.readFile, {context: fs});
const fsStat = Promise.promisify(fs.stat, {context: fs});
const fsExists = Promise.promisify(fs.exists, {context: fs});


let webpackBuildStats = null;

simpleConfig.plugins = [
  new MultipageWebpackPlugin("./template.hbs")
]

test.before('run webpack build first', async t => {
  webpackBuildStats = await runWebpackCompilerMemoryFs(simpleConfig);
});

// Run
test('it should run successfully', async t => {
  let {stats, warnings, errors} = webpackBuildStats;

  t.falsy(stats.hasWarnings() && errors.hasWarnings());
});

test('each default template should contain the correct script tags in it', async t => {
  let {stats, warnings, errors} = webpackBuildStats;
  
  // Returns Buffer
  t.true(
    getEntryKeysFromStats(stats).every(async (entryName) => {
      let templateContent = await readFile(path.join(webpackBuildPath, "templates", entryName, "index.html"));

      return templateContent
        .toString()
        .match(`<script type="text/javascript" src="../../inline.chunk.js"></script><script type="text/javascript" src="../../${entryName}.chunk.js"></script>`)
        .length > 0
      })
  );
});
