import * as path from 'path';
import test from 'ava';
import {runWebpackCompilerMemoryFs, runWebpackCompiler} from './utils.js';
const rimraf = require('rimraf');
const simpleConfig = require('../examples/simple-with-vendor/webpack.config.js');
const simpleExamplePath = path.resolve(__dirname, '../examples/simple-with-vendor');

test.beforeEach('run webpack build first', async t => {
  t.context.stats = await runWebpackCompilerMemoryFs(simpleConfig);
});

// Run
test.skip('webpack should run successfully', async t => {
  let {stats, warnings, errors} = t.context.stats;

  t.falsy(warnings.length && errors.length);
});

test.skip('it should emit a template for each entry point', async t => {
  
});

test.skip('', async t => {
  
});

test.skip('', async t => {
  
});

test.skip('', async t => {
  
});

