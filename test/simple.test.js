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

test.beforeEach('run webpack build first', async t => {
  t.context.stats = await runWebpackCompilerMemoryFs(simpleConfig);
});

// Run
test('webpack should run successfully', async t => {
  let {stats, warnings, errors} = t.context.stats;

  t.falsy(warnings.length && errors.length);
});

test('it should have 1 more js bundles than entries', async t => {
  	let	{stats, warnings, errors} = t.context.stats;
  	let webpackBuildPath = path.resolve(simpleExamplePath, './dist');
  	fs.readdir(webpackBuildPath, (err, fsStats) => {
  		let emittedChunkCount = fsStats.filter(path => {return path.match(/\.js$/)}).length;
	  	let entryCount = Object.keys(stats.compilation.options.entry).length;

	  	t.true(entryCount === emittedChunkCount - 1);
  	});
});

test('The webpack bootstrap should be in a separate chunk [inline.chunk.js]', async t => {
	let	{stats, warnings, errors} = t.context.stats;
  let fsStats = await readdir(webpackBuildPath);

  t.true(fsStats.includes('inline.chunk.js'));
});

test('it should create default template path', async t => {
  let {stats, warnings, errors} = t.context.stats;
  let fsStats = await readdir(webpackBuildPath);

  console.log(fsStats);
});

test('each template should match their entry point', async t => {
  let {stats, warnings, errors} = t.context.stats;
  let itemsInBuildPath = await readdir(webpackBuildPath);
  let itemsInTemplatePath = await readdir(path.join(webpackBuildPath, "templates"));
  let entryCount = Object.keys(stats.compilation.options.entry);
  
  t.deepEqual(itemsInTemplatePath, entryCount);
});

