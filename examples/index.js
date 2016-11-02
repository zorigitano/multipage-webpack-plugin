const fs = require('fs'); 
const path = require('path');
const rimraf = require('rimraf');

cleanAllExamples();
console.log(getExamples());

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
    return path.resolve(__dirname, exampleName+"/dist")
  });

  for (let path of examplesDistPathNames) {
    console.log("CHECK THIS PATH", path);
    let pathStat = fs.statSync(path);


    if (pathStat.isDirectory()) {
      rimraf.sync(path);
    }
  }
}