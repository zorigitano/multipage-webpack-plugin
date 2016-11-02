import * as path from 'path';
import Promise from 'bluebird';
import test from 'ava';
import {
  runWebpackCompilerMemoryFs, 
  getEntryKeysFromStats,  
  testFs
} from './utils.js';


const fs = testFs; // Use shared memoryfs instance
const webpackConfig = require("../examples/multiple-nested-entries/webpack.config.js");
const simpleExamplePath = path.resolve(__dirname, "../examples/multiple-nested-entries");
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

  t.falsy(stats.hasWarnings() && errors.hasWarnings());
});

test('it should emit templates to the correct path', async t => {
  let {stats, warnings, errors} = webpackBuildStats;

  let pathToTemplateDir = await readdir(path.resolve(simpleExamplePath, './resources/views/webpack-partials'));

  t.true(pathToTemplateDir && pathToTemplateDir.length > 0);  
});

test('it should create templates for each entry', async t => {
  let {stats, warnings, errors} = webpackBuildStats;

  let pathToTemplateDir = await readdir(path.resolve(simpleExamplePath, './resources/views/webpack-partials'));

  t.true(getEntryKeysFromStats(stats).every(async entryName => {
    let dirStats = await fsStat(
      path.join(pathToTemplateDir, `${entryName}.twig`)
    );

    return dirStats && dirStats.isFile();
  }))

});

test.todo('it should output templates with .twig extension');

test.todo('it should emit chunks in correct path');

test.todo('each tempalte should only contain script tags');
