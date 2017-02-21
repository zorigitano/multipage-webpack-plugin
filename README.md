# multipage-webpack-plugin
[![Build Status](https://travis-ci.org/mutualofomaha/multipage-webpack-plugin.svg?branch=master)](https://travis-ci.org/mutualofomaha/multipage-webpack-plugin)
[![Coverage Status](https://coveralls.io/repos/github/mutualofomaha/multipage-webpack-plugin/badge.svg?branch=master)](https://coveralls.io/github/mutualofomaha/multipage-webpack-plugin?branch=master)

webpack plugin that allows for trivial configuration for multi page web applications

## Problem

Currently to architect a webpack configuration for multi page web applications, there are many requirements for managing all assets and entry points. 

- In a multipage application every rendered page corresponds to a webpack entry point.
- Each entry point will have some sort of `index.html` file _or_ a MVC framework specific server template (partial) which renders to html content.
  - May have different paths, may not even be in the same directory as the entry point.
  - Should contain _just_ the assets bundled for that entry.
  - You would have to create essentially a `html-webpack-plugin` for each entry however posses extra configuration challenges:
  
  An example for a Laravel 4 Application using Twig Templates

  ```
  const templatesFn = (modules, twigRoot, assetsRoot, shared) => {
    return Object.keys(modules).map((entryName) => {
      return new HtmlWebpackPlugin({
        template: `${assetsRoot}/webpack.template.hbs`, //path.resolve(__dirname, "./assets/webpack.template.hbs"),
        filename: `${twigRoot}/webpack-bundles/${entryName}.twig`,
        chunks: ['inline', 'vendors', entryName, `${shared}`]
      })
    });
  } 
  ```

## Development

- `npm install`


### Single Test Build
- `npm t` 


### Test Watch
- `npm run test:watch`

## Usage [WIP]

### Plugin Options [WIP]
`sharedChunkName`
`vendorChunkName`
`inlineChunkName`
`templateFilename`
`templatePath`
`htmlTemplatePath`
