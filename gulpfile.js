/*global require*/
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
    minifyCss = require('gulp-clean-css'),
    swig = require('gulp-swig'),
    frontMatter = require('gulp-front-matter'),
    data = require('gulp-data'),
    extname = require('gulp-extname'),
    sourcemaps = require('gulp-sourcemaps'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    path = require('path'),
    browserify = require('browserify'),
    watchify = require('watchify'),
    cache = require('gulp-cache'),
    imagemin = require('gulp-imagemin'),
    notify = require('gulp-notify'),
    plumber = require('gulp-plumber'),
    debug = require('gulp-debug'),
    runSequence = require('run-sequence'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    gulpIf = require('gulp-if'),
    babelify = require('babelify'),
    collapse = require('bundle-collapser/plugin'),
    gulpUtil = require('gulp-util'),
    nunjucksRender = require('gulp-nunjucks-render');


/* Set up the banner */
var banner = [
    '/**',
    ' * @name <%= pkg.name %>: <%= pkg.description %>',
    ' * @version <%= pkg.version %>: <%= new Date().toUTCString() %>',
    ' * @author <%= pkg.author %>',
    ' * @license <%= pkg.license %>',
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

/* Build destination */
var outputDir = './build';

/* Where CSS, JS, imgs are piped */
var assetPath = '/content';

/* Source files for the pipe */
var src = {
	css: './src/scss/',
	js: './src/js/',
	html: './src/templates/',
    img: './src/img/'
};

/* Destination for the build */
var dest = {
	css: outputDir + assetPath + '/css/',
	js:  outputDir + assetPath + '/js/',
	html: outputDir,
    img: outputDir + assetPath + '/img/',
    fonts: outputDir + assetPath + '/fonts/'
};

/* Set the PSI variables */
var publicUrl = '', //publicly accessible URL on your local machine, demo, staging, live...
    psiStrategy = 'mobile'; //'mobile' or 'desktop'

/* Error notificaton*/
var onError = function(err) {
    notify.onError({
        title:    "Gulp",
        subtitle: "Failure!",
        message:  "Error: <%= error.message %>",
        sound:    "Beep"
    })(err);

    this.emit('end');
};

/************************
 *  Task definitions 
 ************************/
/* Lint JS */
gulp.task('lint', function() {
	return gulp.src(src.js)
		.pipe(jshint(jshintConfig))
		.pipe(jshint.reporter('default'));
});

gulp.task('js:main', function(){
    return browserify({
            entries: src.js + 'app.js',
            debug: !gulpUtil.env.production
        })
        .transform(babelify, {presets: ['es2015']})
        .bundle()
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe(gulpIf(!!gulpUtil.env.production, uglify()))
        .pipe(gulp.dest(dest.js));
});

gulp.task('js:polyfill', function(){
    return browserify({
            entries: src.js + 'polyfills/polyfills.js',
            debug: !gulpUtil.env.production
        })
        .transform(babelify, {presets: ['es2015']})
        .bundle()
        .pipe(source('polyfills.js'))
        .pipe(buffer())
        .pipe(gulpIf(!!gulpUtil.env.production, uglify()))
        .pipe(gulp.dest(dest.js + '/async/'));
});

gulp.task('js:async', function () {
    return gulp.src(src.js + 'async/**/*')
  		.pipe(uglify())
  		.pipe(rename({suffix: '.min'}))
  		.pipe(gulp.dest(dest.js + 'async/'));
});
gulp.task('js', ['js:main', 'js:async']);

/* Build the flat html */
gulp.task('html', function(){
    return gulp.src(src.html + 'views/**/*.html')
        .pipe(plumber({errorHandler: onError}))
        .pipe(frontMatter({ property: 'data' }))
        .pipe(data(function(file) {
            return {'assetPath': assetPath};
        }))
        .pipe(nunjucksRender({
            path: src.html
        }))
        .pipe(gulp.dest(dest.html));
});

/* 
 * SASS > CSS
 * Build CSS from scss, prefix and add px values from rem
 *
 */
gulp.task('sass', function () {
    return gulp.src([src.css + '**/*.scss', '!' + src.css + '{fonts,kss}/*.*'])
		.pipe(plumber({errorHandler: onError}))
		.pipe(sourcemaps.init())
		.pipe(sass())
		.pipe(autoprefixer(AUTOPREFIXER_BROWSERS))
		.pipe(pixrem())
		.pipe(header(banner, {pkg : pkg}))
		.pipe(sourcemaps.write())
        .pipe(gulpIf(!!gulpUtil.env.production, minifyCss()))
		.pipe(gulp.dest(dest.css));
});


gulp.task('css', ['sass']);

/* Optimize images */
gulp.task('img', function () {
    return gulp.src([src.img + '**/*'])
        .pipe(imagemin({
          progressive: true,
          interlaced: true,
          svgoPlugins: [{removeViewBox: true}]
        }))
        .pipe(gulp.dest(dest.img));
});

/* Fonts */
gulp.task('font', function() {
    return gulp.src(src.fonts + '**/*.*')
        .pipe(gulp.dest(dest.fonts));
});

/* Server with auto reload and browersync */
gulp.task('serve', ['build'], function () {
      browserSync({
        notify: false,
        // https: true,
        server: [outputDir],
        tunnel: false
      });

      gulp.watch([src.html + '**/*.html'], ['html', reload]);
      gulp.watch([src.css + '**/*.scss'], ['css', reload]);
      gulp.watch([src.img + '*'], ['img', reload]);
      gulp.watch([src.js + '**/*'], ['js', reload]);
});

/* Watch */
gulp.task('watch', function () {
      gulp.watch([src.html + '**/*.html'], ['html']);
      gulp.watch([src.css + '**/*.scss'], ['css']);
      gulp.watch([src.img + '**/*'], ['img']);
      gulp.watch([src.js + '**/*'], ['js']);
});


/************************
 *  Task API
 ************************/
/* Start task */
gulp.task('start', ['html', 'css', 'js', 'img', 'font', 'serve']);

/* Final build task including compression */
gulp.task('build', ['html', 'css', 'js']);


/* Default 'refresh' task */
gulp.task('default', ['start']);