const gulp = require('gulp');
const rename = require('gulp-rename');
const babelify = require('babelify');
const browserify = require('browserify');
const gulpIf = require('gulp-if');
const path = require('path');
const find = require('../utils').find;
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const config = require('../gulp.config');
const gulpUtil = require('gulp-util');
const gulpTerser = require('gulp-terser');

const head = (production = false) => () => {
    return browserify({
        entries: `${config.paths.src.js}/head.js`,
        debug: !production,
        fullPaths: !production
    })
        .transform(babelify, { presets: ['env'] })
        .bundle()
        .pipe(source('head.js'))
        .pipe(buffer())
        .pipe(gulpIf(!!production, gulpTerser()))
        .pipe(gulp.dest(`${config.paths.build}/${config.paths.assets}/js`));
};

const core = (production = false) => () => {
    return browserify({
        entries: `${config.paths.src.js}/app.js`,
        debug: !production,
        fullPaths: !production
    })
        .transform(babelify, { presets: ['env'] })
        .bundle()
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe(gulpIf(!!production, gulpTerser()))
        .pipe(gulp.dest(`${config.paths.build}/${config.paths.assets}/js`));
};

const standalone = (production = false) => () => {
    return gulp
        .src(`${config.paths.src.js}/async/**/*`)
        .pipe(gulpIf(!!production, gulpTerser()))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(`${config.paths.build}/${config.paths.assets}/js/async`));
};

const custom = (production = false) => done => {
    const customComponents = find(
        `${config.paths.src.js}/custom-components`,
        path.resolve(__dirname, `../../${config.paths.src.js}/custom-components`),
        /\S+dist\S+\.standalone.js$/
    );

    if (customComponents.length === 0) {
        done();
        return;
    }

    return gulp
        .src(customComponents)
        .pipe(gulpIf(!!production, gulpTerser()))
        .pipe(
            rename(path => {
                path.basename = path.basename.replace('.standalone', '.min');
            })
        )
        .pipe(gulp.dest(`${config.paths.build}/${config.paths.assets}/js/async`));
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
        .pipe(gulpIf(!!production, gulpTerser()))
        .pipe(
            rename({
                basename: 'polyfills',
                suffix: '.min'
            })
        )
        .pipe(gulp.dest(`${config.paths.build}/${config.paths.assets}/js/async`));
};

const tasks = {
    core,
    head,
    standalone,
    custom,
    polyfills
};

for (const subtask of ['head', 'core', 'standalone', 'polyfills', 'custom']) {
    gulp.task(`js:${subtask}`, tasks[subtask](gulpUtil.env.production));
}

gulp.task(
    'js',
    gulp.series('js:custom', gulp.parallel('js:core', 'js:head', 'js:standalone', 'js:polyfills'))
);
