const gulp = require('gulp');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const babelify = require('babelify');
const browserify = require('browserify');
const gulpIf = require('gulp-if');
const path = require('path');
const find = require('../utils').find;
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const config = require('../gulp.config');

const core = (production = false) => () => {
    return browserify({
            entries: `${config.paths.src.js}/app.js`,
            debug: !production,
            fullPaths: !production
        })
        .transform(babelify, { presets: ["env"] })
        .bundle()
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe(gulpIf(!!production, uglify()))
        .pipe(gulp.dest(`${config.paths.build}/${config.paths.assets}/js`));
        //pipe to production
        // .pipe(gulp.dest(config.paths.dest[!!gulpUtil.env.production ? 'production' : 'development'].js));
};

const standalone = (production = false) => () => {
    return gulp.src(`${config.paths.src.js}/async/**/*`)
                        .pipe(gulpIf(!!production, uglify()))
                        .pipe(rename({suffix: '.min'}))
                        .pipe(gulp.dest(`${config.paths.build}/${config.paths.assets}/js/async`));
                        //pipe to production
                        // .pipe(gulp.dest(`${config.paths.dest[!!gulpUtil.env.production ? 'production' : 'development'].js}async/`));
};

const custom = (production = false) => () => {
    return gulp.src(find(`${config.paths.src.js}/custom-components`, path.resolve(__dirname, `../../${config.paths.src.js}/custom-components`), /\S+dist\S+\.standalone.js$/))
                .pipe(gulpIf(!!production, uglify()))
                .pipe(rename(path => {
                    path.basename = path.basename.replace('.standalone', '.min');
                }))
                .pipe(gulp.dest(`${config.paths.build}/${config.paths.assets}/js/async`));
                //pipe to production
                // .pipe(gulp.dest(`${config.paths.dest[!!gulpUtil.env.production ? 'production' : 'development'].js}async/`));
};

const polyfills = (production = false) => () => {
    return browserify({
            entries: `${config.paths.src.js}/polyfills/index.js`,
            debug: !production,
            fullPaths: !production
        })
        .bundle()
        .pipe(source('index.js'))
        .pipe(buffer())
        .pipe(gulpIf(!!production, uglify()))
        .pipe(rename({
            basename: 'polyfills',
            suffix: '.min'
        }))
        .pipe(gulp.dest(`${config.paths.build}/${config.paths.assets}/js/async`));
        //pipe to production
        // .pipe(gulp.dest(`${config.paths.dest[!!gulpUtil.env.production ? 'production' : 'development'].js}async/`));
};

module.exports = {
    core,
    standalone,
    custom,
    polyfills
};