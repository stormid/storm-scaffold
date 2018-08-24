const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const wait = require('gulp-wait');
const sourcemaps = require('gulp-sourcemaps');
const pixrem = require('gulp-pixrem');
const header = require('gulp-header');
const minifyCss = require('gulp-clean-css');
const gulpIf = require('gulp-if');
const config = require('../gulp.config');
const gulpUtil = require('gulp-util');
const pkg = require('../../package.json');
const DELAY = 500;
const plumbErrors = require('../utils').plumbErrors;


gulp.task('css', () => {
    return gulp.src([`${config.paths.src.css}/styles.scss`])
            .pipe(wait(DELAY))
            .pipe(plumbErrors())
            .pipe(sourcemaps.init())
            .pipe(sass())
            .pipe(autoprefixer({
                browsers: pkg.browserlist
            }))
            .pipe(pixrem())
            .pipe(header(config.banner, {pkg : pkg}))
            .pipe(sourcemaps.write())
            .pipe(gulpIf(!!gulpUtil.env.production, minifyCss()))
            .pipe(gulp.dest(`${config.paths.build}/${config.paths.assets}/css`));
});