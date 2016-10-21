import * as path from 'path';
import * as fs from 'fs';
import Promise from 'bluebird';
import test from 'ava';
import {runWebpackCompilerMemoryFs, runWebpackCompiler} from './utils.js';
const rimraf = require('rimraf');
const simpleConfig = require('../examples/simple/webpack.config.js');

const simpleExamplePath = path.resolve(__dirname, '../examples/simple');
const webpackBuildPath = path.resolve(simpleExamplePath, './dist');

const readdir = Promise.promisify(fs.readdir, {context: fs});
const readFile = Promise.promisify(fs.readFile, {context: fs});
const fsReaddir = Promise.promisify(fs.readdir, {context: fs});
const fsReadFile = Promise.promisify(fs.readFile, {context: fs});
const fsStat = Promise.promisify(fs.stat, {context: fs});

let webpackBuildStats = null;

test.before('run webpack build first', async t => {
  webpackBuildStats = await runWebpackCompilerMemoryFs(simpleConfig);
});

// Run
test('it should run successfully', async t => {
  let {stats, warnings, errors} = webpackBuildStats;

  t.falsy(stats.hasWarnings() && errors.hasWarnings());
});

test('output directory should match config output.path', async t => {
  let {stats, warnings, errors} = webpackBuildStats;
  let outputDirectory;

  try {
    outputDirectory = fsStat(webpackBuildPath);
    t.truthy(outputDirectory);  
  } catch (err) {
    t.fail(err);
  }

});

// This tests should change for each fixture based on shared chunks or css chunks or vendor chunks etc.
test('it should have 1 more js bundles than entries', async t => {
    let {stats, warnings, errors} = webpackBuildStats;
    let webpackBuildPath = path.resolve(simpleExamplePath, './dist');
    fs.readdir(webpackBuildPath, (err, fsStats) => {
      let emittedChunkCount = fsStats.filter(path => {return path.match(/\.js$/)}).length;
      let entryCount = Object.keys(stats.compilation.options.entry).length;

      t.true(entryCount === emittedChunkCount - 1);
    });
});

test('it should have the webpack bootstrap in a separate chunk [inline.chunk.js]', async t => {
  let {stats, warnings, errors} = webpackBuildStats;
  let fsStats = await readdir(webpackBuildPath);

  t.true(fsStats.includes('inline.chunk.js'));
});

test('it should create default template path', async t => {
  let {stats, warnings, errors} = webpackBuildStats;
  let fsStats = await readdir(webpackBuildPath);

  t.truthy(fsStats);
});

test('each template should match their entry point', async t => {
  let {stats, warnings, errors} = webpackBuildStats;
  let itemsInBuildPath = await readdir(webpackBuildPath);
  let itemsInTemplatePath = await readdir(path.join(webpackBuildPath, "templates"));
  let entryCount = Object.keys(stats.compilation.options.entry);
  
  t.deepEqual(itemsInTemplatePath, entryCount);
});

test('each template should contain the correct script tags in it', async t => {
  let {stats, warnings, errors} = webpackBuildStats;
  
  // Returns Buffer
  t.true(
    Object.keys(stats.compilation.options.entry).every(async (entryName) => {
      let templateContent = await readFile(path.join(webpackBuildPath, "templates", entryName, "index.html"));

      return templateContent
        .toString()
        .match(`<script type="text/javascript" src="../../inline.chunk.js"></script><script type="text/javascript" src="../../${entryName}.chunk.js"></script>`)
        .length > 0
      })
  );
});




