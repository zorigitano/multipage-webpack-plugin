import * as path from 'path';
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
  const stats = t.context.stats;
  console.log("ENTRYPOINTS PROPERTY", stats);
  t.truthy(stats);
});

test.skip('it should emit a template for each entry point', async t => {
  
});

test.skip('it should emit template into default path', async t => {
  
});

test.skip('each template should have an inline.chunk.js', async t => {
  
});

test.skip('each template should match their entry point', async t => {
  
});

