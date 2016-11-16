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
  const {stats, warnings, errors} = webpackBuildStats;

  t.falsy(stats.hasWarnings() && errors.hasWarnings());
});

test.skip('it should emit templates to the correct path', async t => {
  const {stats, warnings, errors} = webpackBuildStats,
        pathToTemplateDir = await readdir(path.resolve(simpleExamplePath, './resources/views/webpack-partials'));

  t.true(pathToTemplateDir && pathToTemplateDir.length > 0);  
});

test.skip('it should create templates for each entry', async t => {
  const {stats, warnings, errors} = webpackBuildStats,
        pathToTemplateDir = await readdir(path.resolve(simpleExamplePath, './resources/views/webpack-partials'));

  t.true(getEntryKeysFromStats(stats).every(async entryName => {
    const dirStats = await fsStat(
      path.join(pathToTemplateDir, `${entryName}.twig`)
    );

    return dirStats && dirStats.isFile();
  }));

});

test('it should output templates with .twig extension', async t => {
  const {stats, warnings, errors} = webpackBuildStats,
        itemsInTemplateDir = await readdir(path.resolve(simpleExamplePath, './resources/views/webpack-partials/'));

  t.true(itemsInTemplateDir.every(async file => {
    return file.endsWith('.twig');
  }));

});

test('it should emit chunks in correct path', async t => {
  const {stats, warnings, errors} = webpackBuildStats;

  t.true(getEntryKeysFromStats(stats).every(async entryName => {
    const dirStats = await fsStat(
      path.join(webpackBuildPath, `${entryName}.bundle.js`)
    );

    return dirStats && dirStats.isFile();
  }));
});

test('each template should only contains script tags', async t => {
  const {stats, warnings, errors} = webpackBuildStats,
        pathToTemplateDir = await readdir(path.resolve(simpleExamplePath, './resources/views/webpack-partials'));

  t.true(getEntryKeysFromStats(stats).every(async entryName => {
    const templateContent = await readFile(
      path.join(pathToTemplateDir, `${entryName}.twig`)
    );

    return templateContent
      .toString()
      .match(`<script type="text/javascript" src="../../inline.chunk.js"></script><script type="text/javascript" src="../../vendors.chunk.js"></script><script type="text/javascript" src="../../shared.chunk.js"></script><script type="text/javascript" src="../../${entryName}.chunk.js"></script>`)
      .length > 0
    });
});
