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
    notify = require('gulp-notify'),
    plumber = require('gulp-plumber'),
    iconfont = require('gulp-iconfont'),
    iconfontCss = require('gulp-iconfont-css'),
    jshint = require('gulp-jshint'),
    jshintConfig = pkg.jshintConfig;


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

var assetPath = '/assets';

/* Source files for the pipe */
var srcs = {
	css: './src/scss/',
	js: './src/js/',
	html: './src/templates/',
    img: './src/img/',
    iconfonts: './src/iconfonts/'
};

/* Destination for the build */
var dest = {
	css: './build' + assetPath + '/css/',
	js: './build' + assetPath + '/js/',
	html: './build/',
    img: './build' + assetPath + '/img/',
    iconfonts: './build' + assetPath + '/iconfonts/'
};

/* Icon font name */
var iconFontName = 'icons';

/* Set the PSI variables */
var publicUrl = 'www.google.com',
    psiStrategy = 'mobile';

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
	return gulp.src(srcs.js)
		.pipe(jshint(jshintConfig))
		.pipe(jshint.reporter('default'));
});

/* Concat the js */
gulp.task('js', function() {
	return gulp.src([srcs.js + '**/!(app)*.js', srcs.js + 'app.js'])
		.pipe(plumber({errorHandler: onError}))
		.pipe(sourcemaps.init())
		.pipe(concat('app.js'))
		.pipe(sourcemaps.write())
		.pipe(header(banner, {pkg : pkg}))
		.pipe(gulp.dest(dest.js));
});

/* Build the flat html */
gulp.task('html', function(){
    return gulp.src(srcs.html + 'views/**/*.html')
      .pipe(frontMatter({ property: 'data' }))
      .pipe(data(function(file) {
        return {'assetPath': assetPath};
      }))
      .pipe(swig({
        defaults: {
          cache: false
        }
      }))
      .pipe(gulp.dest(dest.html));
});

/* Build CSS from scss, prefix and add px values */
gulp.task('sass', function () {
	return gulp.src(srcs.css + '**/*.scss')
		.pipe(plumber({errorHandler: onError}))
		.pipe(sourcemaps.init())
		.pipe(sass())
		.pipe(autoprefixer(AUTOPREFIXER_BROWSERS))
		.pipe(pixrem())
		.pipe(sourcemaps.write())
		.pipe(header(banner, {pkg : pkg}))
		.pipe(gulp.dest(dest.css));
});
gulp.task('css', ['sass']);

/* Optimize images */
gulp.task('img', function () {
    return gulp.src([srcs.img + '**/*'])
        .pipe(imagemin({
          progressive: true,
          interlaced: true,
          svgoPlugins: [{removeViewBox: true}]
        }))
        .pipe(gulp.dest(dest.img));
});

/* Iconfonts */
gulp.task('iconfont', function(){
  return gulp.src(srcs.iconfonts + '**/SVG/*.svg')
            .pipe(plumber({errorHandler: onError}))
            .pipe(iconfont({
                  fontName: iconFontName,
                  appendCodepoints: true,
                  normalize: false
            }))
            .on('codepoints', function(codepoints, options) {
                return gulp.src(srcs.html + 'asset/iconfont.scss')
                .pipe(swig({
                    data: {
                        glyphs: codepoints.map(function(icon) {
                          return {
                            name: icon.name,
                            code: icon.codepoint.toString(16)
                          };
                        }),
                        fontName: iconFontName,
                        fontPath: dest.iconfonts,
                        className: iconFontName
                    }
                }))
                .pipe(rename('_iconfont.scss'))
                .pipe(gulp.dest(srcs.css + 'base/'));
            })
            .pipe(gulp.dest(dest.iconfonts));
});

/* Compress js */
gulp.task('compress:js', function() {
	return gulp.src(dest.js + 'app.js')
		.pipe(uglify())
		.pipe(rename('app.min.js'))
		.pipe(gulp.dest(dest.js));
});

/* Compress CSS */
gulp.task('compress:css', function() {
	return gulp.src(dest.css + 'styles.css')
		.pipe(csso())
        .pipe(rename('styles.min.css'))
		.pipe(gulp.dest(dest.css));
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
      gulp.watch([srcs.img + '*'], ['img', reload]);
      gulp.watch([srcs.js], ['js', reload]);
});

/* Page speed insights */
gulp.task('psi', function(cb) {
  pagespeed.output(publicUrl, {
    strategy: psiStrategy,
  }, cb);
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