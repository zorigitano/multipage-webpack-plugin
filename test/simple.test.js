import * as path from 'path';
import * as fs from 'fs';
import test from 'ava';
import {runWebpackCompilerMemoryFs, runWebpackCompiler} from './utils.js';
const rimraf = require('rimraf');
const simpleConfig = require('../examples/simple/webpack.config.js');
const simpleExamplePath = path.resolve(__dirname, '../examples/simple');



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
  	let buildPath = path.resolve(simpleExamplePath, './dist');
  	fs.readdir(buildPath, (err, fsStats) => {
  		let emittedChunkCount = fsStats.filter(path => {return path.match(/\.js$/)}).length;
	  	let entryCount = Object.keys(stats.compilation.options.entry).length;

	  	t.true(entryCount === emittedChunkCount - 1);
  	});
});

test('it should contain inline.js file', async t => {
	let	{stats, warnings, errors} = t.context.stats;
  	let buildPath = path.resolve(simpleExamplePath, './dist');

  	fs.readdir(buildPath, (err, fsStats) => {





  		
  	})
});

test.skip('it should emit template into default path', async t => {
  
});

test.skip('each template should have an inline.chunk.js', async t => {
  
});

test.skip('each template should match their entry point', async t => {
  
});

