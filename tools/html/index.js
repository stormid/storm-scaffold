const gulp = require('gulp');
const nunjucksRender = require('gulp-nunjucks-render');
const plumbErrors = require('../utils').plumbErrors;
const config = require('../gulp.config');
const frontMatter = require('gulp-front-matter');
const data = require('gulp-data');

gulp.task('html', () => {
    return gulp.src(`${config.paths.src.html}/views/**/*.html`)
            .pipe(plumbErrors())
            .pipe(frontMatter({ property: 'data' }))
			.pipe(data(() => { return { 'assets': config.paths.assets }; }))
            .pipe(nunjucksRender({
                path: config.paths.src.html
            }))
            .pipe(gulp.dest(config.paths.build));
});