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
const examplePath = path.resolve(__dirname, "../examples/multiple-nested-entries");
const webpackBuildPath = path.join(examplePath, "dist","js");

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


test('it should emit templates to the correct path', async t => {
  let {stats, warnings, errors} = webpackBuildStats;
  let pathToTemplateDir = await readdir(path.resolve(examplePath, './resources/views/webpack-partials'));

  t.true(pathToTemplateDir && pathToTemplateDir.length > 0);  
});

test('it should create templates for each entry', async t => {
  let {stats, warnings, errors} = webpackBuildStats;
  let templateDir = path.resolve(examplePath, './resources/views/webpack-partials');
  let pathToTemplateDir = await readdir(templateDir);

  t.true(getEntryKeysFromStats(stats).every(async entryName => {
    try {
      let dirStats = await fsStat(
        path.resolve(templateDir, entryName + ".twig")
      );
      return dirStats && dirStats.isFile(); 
    } catch(e) {
      throw(e);
    }
  }))
});

test('it should output templates with .twig extension', async t => {
  const {stats, warnings, errors} = webpackBuildStats;
  let templateDir = path.resolve(examplePath, './resources/views/webpack-partials');
  let pathToTemplateDir = await readdir(templateDir);

  t.true(pathToTemplateDir.every(async file => {
    return file.endsWith('.twig');
  }));

});

test('it should emit chunks in correct path', async t => {
  const {stats, warnings, errors} = webpackBuildStats;

  t.true(getEntryKeysFromStats(stats).every(async entryName => {
    let pathToChunks = path.join(webpackBuildPath, entryName + ".chunk.js");
    try {
      const dirStats = await fsStat(pathToChunks);
      return dirStats && dirStats.isFile();
    } catch(e) {
      throw(e);
    }

  }));
});

test('each template should only contains script tags', async t => {
  const {stats, warnings, errors} = webpackBuildStats;
  let templateDir = path.resolve(examplePath, './resources/views/webpack-partials');
  let pathToTemplateDir = await readdir(templateDir);

  t.true(getEntryKeysFromStats(stats).every(async entryName => {
    const templateContent = await readFile(
      path.join(templateDir, `${entryName}.twig`)
    );

    return templateContent
      .toString()
      .match(`<script type="text/javascript" src="public/js/inline.chunk.js"></script><script type="text/javascript" src="public/js/shared.chunk.js"></script><script type="text/javascript" src="public/js/${entryName}.chunk.js"></script></body>`)
      .length > 0
  }));
});
