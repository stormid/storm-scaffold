var gulp = require('gulp'),
	pkg = require('./package.json'),
	browserify = require('gulp-browserify'),
	gutil = require('gulp-util'),
	del = require('del'),
	sass = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	concat = require('gulp-concat'),
	header = require('gulp-header'),
	pixrem = require('gulp-pixrem'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	csso = require('gulp-csso'),
	connect = require('gulp-connect'),
    swig = require('gulp-swig'),
    frontMatter = require('gulp-front-matter'),
    data = require('gulp-data'),
	pagespeed = require('psi'),
	extname = require('gulp-extname'),
    path = require('path');

var publicUrl = 'www.google.com';

var banner = [
    '/**',
    ' * @name <%= pkg.name %>: <%= pkg.description %>',
    ' * @version <%= pkg.version %> <%= new Date().toUTCString() %>',
    ' * @author <%= pkg.author %>',
    ' * @license <%= pkg.license %>',
    ' * @url <%= pkg.repository.url %>',
    ' */'
].join('\n');

var AUTOPREFIXER_BROWSERS = [
  'ie >= 9',
  'ie_mob >= 10',
  'ff >= 20',
  'chrome >= 4',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];

var srcFiles = {
	css : './src/scss/',
	js : ['src/js/libs/fastclick.js',
		  'src/js/libs/ender.js',
		  'src/js/app.js'],
	html : './src/templates/views/'
};

var dest = {
	css: './build/css/',
	js: 'build/js/',
	html: './build/'
};

gulp.task('js', function() {
  gulp.src(srcFiles.js)
    .pipe(concat('app.js'))
    .pipe(gulp.dest(dest.js));
});

gulp.task('html', function(){
    gulp.src(srcFiles.html + '**/*.html')
      .pipe(frontMatter({ property: 'data' }))/*
      .pipe(data(function(file) {
        //return require(path.basename(file.path) + '.json');
      }))*/
      .pipe(swig())
      .pipe(gulp.dest(dest.html));
});

gulp.task('psi', function(cb) {
  pagespeed.output(publicUrl, {
    strategy: 'mobile',
  }, cb);
});

gulp.task('sass', function () {
    gulp.src(srcFiles.css + '**/*.scss')
        .pipe(sass())
    	.pipe(autoprefixer(AUTOPREFIXER_BROWSERS))
    	.pipe(pixrem())
        .pipe(gulp.dest(dest.css));
});
gulp.task('css', ['sass']);

gulp.task('compress:js', function() {
	gulp.src(dest.js + 'app.js')
		.pipe(uglify())
		.pipe(rename('app.min.js'))
		.pipe(gulp.dest(dest.js))
		.pipe(connect.reload());
});

gulp.task('compress:css', function() {
	gulp.src(dest.css + 'styles.css')
		.pipe(csso())
        .pipe(rename('styles.min.css'))
		.pipe(gulp.dest(dest.css))
		.pipe(connect.reload());
});

gulp.task('compress', ['compress:css', 'compress:js']);

gulp.task('webserver', function() {
  connect.server({
    livereload: true,
	root: 'build',
  });
});

gulp.task('watch', function () {
    gulp.watch([srcFiles.js + '*.js', srcFiles.js + '**/*.js'], ['js', 'compress:js']);
  	gulp.watch(srcFiles.css + '**/*.scss', ['css', 'compress:css']);
});

gulp.task('default', ['webserver', 'css', 'js', 'compress', 'watch']);
