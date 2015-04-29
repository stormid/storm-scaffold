/* Require the gulp and node packages */
var gulp = require('gulp'),
	pkg = require('./package.json'),
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
	sourcemaps = require('gulp-sourcemaps'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    path = require('path'),
    cache = require('gulp-cache'),
    imagemin = require('gulp-imagemin'),
    jshint = require('gulp-jshint'),
    jshintConfig = pkg.jshintConfig;


/* Set up the banner */
var banner = [
    '/**',
    ' * @name <%= pkg.name %>: <%= pkg.description %>',
    ' * @version <%= pkg.version %> <%= new Date().toUTCString() %>',
    ' * @author <%= pkg.author %>',
    ' * @license <%= pkg.license %>',
    ' * @url <%= pkg.repository.url %>',
    ' */'
].join('\n');

/* Autoprefixer settings */
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

/* Source files for the pipe */
var srcs = {
	css: './src/scss/',
	js: ['src/js/libs/fastclick.js',
		  'src/js/libs/ender.js',
		  'src/js/app.js'],
	html: './src/templates/views/',
    img: './src/img/'
};

/* Destination for the build */
var dest = {
	css: './build/css/',
	js: 'build/js/',
	html: './build/',
    img: './build/img/'
};

/* Set the PSI variables */
var publicUrl = 'www.google.com',
    psiStrategy = 'mobile';


/************************
 *  Task definitions 
 ************************/

/* Lint JS */
gulp.task('lint', function() {
    return gulp.src(srcs.js)
      .pipe(jshint(jshintConfig))
      .pipe(jshint.reporter('default'));
});

/* Concat the js */
gulp.task('js', function() {
  gulp.src(srcs.js)
    .pipe(sourcemaps.init())
    .pipe(concat('app.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(dest.js));
});

/* Build the flat html */
gulp.task('html', function(){
    return gulp.src(srcs.html + '**/*.html')
      .pipe(frontMatter({ property: 'data' }))/*
      .pipe(data(function(file) {
        //return require(path.basename(file.path) + '.json');
      }))*/
      .pipe(swig())
      .pipe(gulp.dest(dest.html));
});

/* Page speed insights */
gulp.task('psi', function(cb) {
  pagespeed.output(publicUrl, {
    strategy: psiStrategy,
  }, cb);
});

/* Build CSS from scss, prefix and add px values */
gulp.task('sass', function () {
    return gulp.src(srcs.css + '**/*.scss')
      .pipe(sourcemaps.init())
      .pipe(sass())
      .pipe(autoprefixer(AUTOPREFIXER_BROWSERS))
      .pipe(pixrem())
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(dest.css));
});
gulp.task('css', ['sass']);


/* Optimize images */
gulp.task('img', function () {
  return gulp.src(srcs.img + '*')
    .pipe(cache(imagemin({
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest(dest.img));
});


/* Compress js */
gulp.task('compress:js', function() {
	return gulp.src(dest.js + 'app.js')
		.pipe(uglify())
		.pipe(rename('app.min.js'))
		.pipe(gulp.dest(dest.js))
		.pipe(connect.reload());
});

/* Compress CSS */
gulp.task('compress:css', function() {
	return gulp.src(dest.css + 'styles.css')
		.pipe(csso())
        .pipe(rename('styles.min.css'))
		.pipe(gulp.dest(dest.css))
		.pipe(connect.reload());
});

/* Server with auto reload and browersync */
gulp.task('serve', ['css'], function () {
  browserSync({
    notify: false,
    // https: true,
    server: ['build']
  });

  gulp.watch([srcs.html + '**/*.html'], ['html', reload]);
  gulp.watch([srcs.css + '**/*.scss'], ['css', reload]);
  gulp.watch([srcs.js + '*.js', srcs.js + '**/*.js'], ['js', reload]);
  gulp.watch([srcs.js + '**/*'], reload);
});


/************************
 *  Task collections 
 ************************/
/* Default 'refresh' task */
gulp.task('default', ['html', 'css', 'js']);

/* Final build task including compression */
gulp.task('build', ['html', 'css', 'js', 'compress']);

/* The compress task */
gulp.task('compress', ['compress:css', 'compress:js']);