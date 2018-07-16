const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const plumber = require('gulp-plumber');
const wait = require('gulp-wait');
const sourcemaps = require('gulp-sourcemaps');
const pixrem = require('gulp-pixrem');
const header = require('gulp-header');
const minifyCss = require('gulp-clean-css');

export const compileSCSS = production => {
    return gulp.src([`${config.paths.src.css}/**/*.scss`])
            .pipe(wait(500))
            .pipe(plumber({errorHandler: onError}))
            .pipe(sourcemaps.init())
            .pipe(sass())
            .pipe(autoprefixer({
                browsers: pkg.browserlist
            }))
            .pipe(pixrem())
            .pipe(header(config.banner, {pkg : pkg}))
            .pipe(sourcemaps.write())
            .pipe(gulpIf(!!production, minifyCss()))
            .pipe(gulp.dest(`${config.paths.public}/${config.paths.staticAssets}/css`));
            // .pipe(gulp.dest(config.paths.dest[!!gulpUtil.env.production ? 'production' : 'development'].css));
            //pipe to production
};