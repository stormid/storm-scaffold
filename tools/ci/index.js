const gulpSRI = require('gulp-sri');
const zip = require('gulp-zip');
const gulp = require('gulp');
const config = require('../gulp.config');

const sri = () => {
    return gulp.src([`${config.paths.build}/${config.paths.assets}/js/**/*`, `${config.paths.build}/${config.paths.assets}/css/**/*`])
            .pipe(gulpSRI({
                transform: hashes => Object.keys(hashes).reduce((acc, curr) => { return acc[curr.replace(/build\//, '')] = hashes[curr], acc; }, {})
            }))
            .pipe(gulp.dest(config.paths.artefacts));
};

const artefacts = () => {
    return gulp.src(`${config.paths.build}/**/**.*`)
        .pipe(zip('build.zip'))
        .pipe(gulp.dest(config.paths.artefacts))
};

gulp.task('ci:artefacts', artefacts);
gulp.task('ci:sri', sri);