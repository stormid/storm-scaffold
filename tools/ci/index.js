const gulpSRI = require('gulp-sri');
const zip = require('gulp-zip');
const gulp = require('gulp');
const config = require('../gulp.config');

//read js and css files and write hash and filenames to json
const sri = () => {
    return gulp.src([`${config.paths.public}/${config.paths.staticAssets}/js/**.*`, `${config.paths.public}/${config.paths.staticAssets}/css/**.*`])
            .pipe(gulpSRI())
            .pipe(gulp.dest(config.paths.artefacts));
};

const artefacts = () => {
        gulp.src(`${config.paths.public}/**/**.*`)
            .pipe(zip('build.zip'))
            .pipe(gulp.dest(config.paths.artefacts))
};

module.exports = { sri, artefacts };