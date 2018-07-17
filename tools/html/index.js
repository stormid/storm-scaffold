const gulp = require('gulp');
const nunjucksRender = require('gulp-nunjucks-render');
const plumbErrors = require('../utils').plumbErrors;
const config = require('../gulp.config');

module.exports = () => {
    return gulp.src(`${config.paths.src.html}/views/**/*.html`)
            .pipe(plumbErrors())
            .pipe(nunjucksRender({
                path: config.paths.src.html
            }))
            .pipe(gulp.dest(config.paths.eject));
};