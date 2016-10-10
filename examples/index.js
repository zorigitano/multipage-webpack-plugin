const fs = require('fs'); 
const path = require('path');

debugger;
let examples = fs.readdirSync("./examples").filter(function(string) {
  return string !== "index.js";
});

console.log(examples);

let configs = examples.map(function(example) {
  let exampleModule = require(`./${example}/webpack.config.js`);
  return exampleModule;
});

module.exports = configs;