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
  new MultipageWebpackPlugin({htmlTemplatePath: path.resolve(__dirname, "../examples/simple/template.ejs")})
]

test.before('run webpack build first', async t => {
  webpackBuildStats = await runWebpackCompilerMemoryFs(simpleConfig);
});

// Run
test('it should run successfully', async t => {
  let {stats, warnings, errors} = webpackBuildStats;

  t.falsy(stats.hasWarnings() && errors.hasWarnings());
});


test('custom template should contain the correct content string from template', async t => {
  let {stats, warnings, errors} = webpackBuildStats;
  let allTemplatesMatch = true;
  // Returns Buffer
  
  let entries = await getEntryKeysFromStats(stats);

  for(let entryName of entries) {
    let templateContent = await readFile(path.join(webpackBuildPath, "templates", entryName, "index.html"));

    if (!templateContent.toString().startsWith("<div>TEST TEMPLATE</div>")) {
      allTemplatesMatch = false;
    }
  }

  t.true(allTemplatesMatch);
});
