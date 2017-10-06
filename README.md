## How to run this project

### Installation
#### `yarn install`

### Run
#### `yarn run start`

### Production
#### `yarn run production`

## JS
The app uses es6 modules that are transpiled, then transformed using browserify into a minified single app.js containing the core js used on every page.

Page or component-specific JS files should be loaded asynchronously as required. These files, which need to be browser-ready or UMD, should be placed in src/js/async.

## CSS
SCSS, structured thus:

- global
- modules/
- components/
- utils/
- vendor/

All project configurations and variables are set in global/_variables.scss.

## HTML
Nunjucks templates. 

1. Layout templates defining the overall structure of the complete HTML document.
2. View templates, one for each page on the website, the structure of the statoc build site follows the structure of the views
3. Partial templates contain components. Naming convention recommended for these:
    - doc- prefix for fundamental document blocks like the head
    - ui- prefix for permanent UI elements like the navigation
    - block- prefix for other components
4. Macros templates contain components. Naming convention recommended for these:

Variables can be set in YAML in the head of each template.

## Gulp Tasks
Add a production flag to run in production mode, and compress everything
#### `gulp --production`

#### `gulp start`

Builds everything from the ground up, watches for changes and rebuilds as refreshes. 

#### `gulp`

Runs gulp start (see above)

#### `gulp serve`

Starts the local webserver with browsersync, watches for changes to the source JS, SCSS, swig HTML templates and images, and runs the corresponding task.

#### `gulp css`

Compiles the SCSS source files into a single CSS file and creates a minified copy.

#### `gulp js`

Builds and transforms the commonjs files into a single compressed browser-ready JS file, copies and compresses the JS files that are asynchronously loaded, and transforms, minifies and copies JS polyfills

#### `gulp html`

Builds the static HTML from nunjucks templates.

