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
    favicons = require('gulp-favicons'),
    notify = require('gulp-notify'),
    plumber = require('gulp-plumber'),
    Pageres = require('pageres'),
    iconfont = require('gulp-iconfont'),
    iconfontCss = require('gulp-iconfont-css'),
    inlinesource = require('gulp-inline-source'),
    critical = require('critical'),
    criticalcss = require('criticalcss'),
    debug = require('gulp-debug'),
    runSequence = require('run-sequence'),
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
    iconfonts: './src/iconfonts/',
    favicon: './src/favicon/schooner.svg'
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
var iconFontName = 'icon';

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
	return gulp.src([srcs.js + '!(inline)**/!(app)*.js', srcs.js + 'app.js'])
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


/* 
 * SASS > CSS
 * Build CSS from scss, prefix and add px values from rem
 *
 */
gulp.task('sass:main', function () {
	//return gulp.src(srcs.css + '**!(fonts)/*.scss')
    return gulp.src([srcs.css + '**/*.scss', '!' + srcs.css + 'fonts/*.scss'])
		.pipe(plumber({errorHandler: onError}))
		.pipe(sourcemaps.init())
		.pipe(sass())
		.pipe(autoprefixer(AUTOPREFIXER_BROWSERS))
		.pipe(pixrem())
		.pipe(sourcemaps.write())
		.pipe(header(banner, {pkg : pkg}))
		.pipe(gulp.dest(dest.css));
});

gulp.task('sass:fonts', function () {
	return gulp.src(srcs.css + 'fonts/*.scss')
		.pipe(plumber({errorHandler: onError}))
		.pipe(sass())
		.pipe(autoprefixer(AUTOPREFIXER_BROWSERS))
		.pipe(pixrem())
        .pipe(concat('fonts.css'))
		.pipe(gulp.dest(dest.css));
});
gulp.task('css', ['sass:main', 'sass:fonts']);

/* Optimize images */
gulp.task('img', function () {
    return gulp.src([dest.img + '**/*'])
        .pipe(imagemin({
          progressive: true,
          interlaced: true,
          svgoPlugins: [{removeViewBox: true}]
        }))
        .pipe(gulp.dest(dest.img));
});

/*
 * Critical CSS 
 * copy full CSS file to all.css
 * inline critical CSS for the homepage based on viewport dimensions
 * inline stylesheet based on 'inline' attribute 
 */
gulp.task('copystyles', function () {
    return gulp.src(dest.css + 'styles.css')
        .pipe(rename({
            basename: "all"
        }))
        .pipe(gulp.dest(dest.css));
});

gulp.task('critical', function () {
    critical.generate({
        base: 'build/',
        src: 'index.html',
        dest: './assets/css/styles.css',
        width: 1300,
        height: 800
    });
});

gulp.task('inlinesource', function(){
    var inlineoptions = {
        rootpath: './',
        compress: false
    };
    return gulp.src(dest.html + '**/*.html')
        .pipe(inlinesource(inlineoptions))//inline everything marked with inline attribiute
        .pipe(gulp.dest(dest.html));
});

gulp.task('inline', function() {
    runSequence('html', 'copystyles', 'critical', 'inlinesource');
});

/* 
 * Cannot add favicon links to the head partial and create the favicon files
 * to do: limit number of icons produced
 * bug: duplicate output
 */
gulp.task('favicons', function () {
    return gulp.src(dest.html + '**/*.html')
        .pipe(favicons({
            files: {
                src: srcs.favicon,
                dest: './'
            },
            icons: {
                android: true,
                appleIcon: true,
                appleStartup: true,
                coast: true,
                favicons: true,
                firefox: false,
                opengraph: true,
                windows: true,
                yandex: false
            }
        }))
        .pipe(gulp.dest(dest.html));
});


/* 
 * Iconfonts
 * Creates font files from SVGs
 * Creates font SCSS file
 */
gulp.task('iconfonts', function(){
  return gulp.src(srcs.iconfonts + '**/*.svg', {
                buffer: false
            })
            .pipe(plumber({errorHandler: onError}))
            .pipe(iconfont({
              fontName: 'icon',
              appendCodepoints: true,
              normalize: true
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
                        fontPath: assetPath + '/iconfonts/',
                        className: iconFontName
                    }
                }))
                .pipe(rename('iconfonts.scss'))
                .pipe(gulp.dest(srcs.css + 'fonts/'));
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
        server: ['build'],
        tunnel: true
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

/* Responsive screenshots
 * to do: run once, close server
 *
gulp.task('responsive', ['serve'], function () {
    var resolutions = ['1920x1080', '1680x1050', '768x1024', '320x480'];
    if (resolutions.length > 0) {
        browserSync.emitter.on('service:running', function (data) {
            var pageres = new Pageres()
                .src(data.tunnel, resolutions, { crop: true })
                .dest('test/screenshots/');
            pageres.run(function (error) {
                if (error) {
                    throw error;
                }
                browserSync.exit();
            });
        });
    }
});
 */

/************************
 *  Task collection API
 ************************/
/* Default 'refresh' task */
gulp.task('default', ['html', 'css', 'js']);

/* Final build task including compression */
gulp.task('build', ['html', 'css', 'js', 'compress']);

/* The compress task */
gulp.task('compress', ['compress:css', 'compress:js']);