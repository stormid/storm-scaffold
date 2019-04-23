## How to run this project

### Installation
```npm install```

### Run
```npm start```

### Production run
```npm run production```

### CI build
Production build, plus generates artefacts and SRI hash json file

```npm run ci```

### Tests
Jest (https://jestjs.io/docs/en/api) is included.

```npm t```


## JS
The app uses es6 modules that are transpiled then transformed using browserify into a minified single app.js containing the core js used on every page.

Page or component-specific JS files should be loaded asynchronously as required. These files, which need to be browser-ready or UMD, should be placed in src/js/async.

Custom components that require their own build system to generate standalone modules for async import can be added to a 'src/js/custom-components' directory. The easiest way to build standalone modules that are consumed by the build is to use https://github.com/mjbp/storm-component-boilerplate.

## CSS
SCSS, with a partial structure

- abstracts
- base/
- components/
- layout/
- vendor/

All project configurations and variables are set in abstracts/_variables.scss.

## HTML
Nunjucks templates, (https://mozilla.github.io/nunjucks/)

1. Layout templates defining the overall structure of the complete HTML document.
2. View templates, one for each page on the website, the structure of the static build site follows the structure of the views
3. Macro templates contain functional components
4. Partial view templates contain components

Variables can be set in yml in the head of each template.

## Gulp Tasks
The key build tasks should be run via npm scripts, but the full gulp API can be read at the bottom of the gulpfile. 

Add a production flag to run in production mode, and compress everything.

```node node_modules/.bin/gulp start --production```