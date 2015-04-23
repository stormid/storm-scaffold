var assemble = require('assemble');
var extname = require('gulp-extname');

assemble.layouts('src/templates/layouts/*.hbs');
assemble.partials('src/templates/partials/**/*.hbs');

assemble.task('html', function () {
  assemble.src(['src/templates/views/*.hbs'])
    .pipe(extname())
    .pipe(assemble.dest('build'));
});

assemble.task('default', ['html']);