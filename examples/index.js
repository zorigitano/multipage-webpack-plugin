const fs = require('fs'); 
const path = require('path');

let examples = fs.readdirSync(__dirname).filter(function(string) {
  return !["index.js", ".DS_Store"].includes(string);
});

console.log(examples);

let configs = examples.map(function(example) {
  let exampleModule = require(`./${example}/webpack.config.js`);
  return exampleModule;
});

module.exports = configs;