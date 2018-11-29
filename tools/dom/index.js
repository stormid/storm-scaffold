const gulp = require('gulp');
const render = require('./render');

gulp.task('dom', () => {
    return render();
});