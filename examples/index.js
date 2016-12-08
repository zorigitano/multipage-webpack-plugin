const fs = require('fs'); 
const path = require('path');
const rimraf = require('rimraf');

cleanAllExamples();

let configs = getExamples().map(function(example) {
  let exampleModule = require(`./${example}/webpack.config.js`);
  return exampleModule;
});

module.exports = configs;

exports.getExamples = getExamples;
exports.cleanAllExamples = cleanAllExamples;

function getExamples(){
  return fs.readdirSync(__dirname).filter(function(readdirItem) {
    let itemPath = path.join(__dirname, readdirItem);
    
    return fs.statSync(itemPath).isDirectory();
  });
}

function cleanAllExamples() {
  let examplesDistPathNames = getExamples().map(function(exampleName) {
    return path.join(__dirname, exampleName, "dist");
  });

  for (let path of examplesDistPathNames) {
    fs.stat(path, (err, stat) => {
      if (err) return; 
    
      if (stat.isDirectory()) {
        rimraf.sync(path);
      }
    });
  }
}
