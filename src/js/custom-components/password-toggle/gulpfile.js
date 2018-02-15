var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    pkg = require('./package.json'),
    header = require('gulp-header'),
    wrap = require('gulp-wrap-umd'),
    notify = require('gulp-notify'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    babel = require('gulp-babel'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    babelify = require( 'babelify'),
    browserSync = require('browser-sync'),
    ghPages = require('gulp-gh-pages'),
    runSequence = require('run-sequence'),
    reload = browserSync.reload;

/* Set up the banner */
var banner = [
    '/**',
    ' * @name <%= pkg.name %>: <%= pkg.description %>',
    ' * @version <%= pkg.version %>: <%= new Date().toUTCString() %>',
    ' * @author <%= pkg.author %>',
    ' * @license <%= pkg.license %>',
    ' */\n'
].join('\n');

/* Wrapper to support es5 window and commonjs with same syntax */ 
var umdTemplate = ["(function(root, factory) {",
                    "   var mod = {",
                    "       exports: {}",
                    "   };",
                    "   if (typeof exports !== 'undefined'){",
                    "       mod.exports = exports",
                    "       factory(mod.exports)",
                    "       module.exports = mod.exports.default",
                    "   } else {",
                    "       factory(mod.exports);",
                    "       root.<%= namespace %> = mod.exports.default",
                    "   }\n",
                    "}(this, function(exports) {",
                    "   <%= contents %>;",
                    "}));\n"
                    ].join('\n');

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

var componentName = function(){
	return pkg.name.split('-').map(function(w){ return w.substr(0, 1).toUpperCase() + w.substr(1); }).join('');
};

/************************
 *  Task definitions 
 ************************/
gulp.task('js:es5', function() {
    return gulp.src('src/*.js')
        .pipe(plumber({errorHandler: onError}))
        .pipe(babel({
			presets: ['es2015']
		}))
        .pipe(wrap({
            namespace: componentName(),
            template: umdTemplate
        }))
        .pipe(header(banner, {pkg : pkg}))
  		.pipe(rename({suffix: '.standalone'}))
		.pipe(gulp.dest('dist/'));
});

gulp.task('js:es5-browserify', function() {
    return browserify({
            entries: 'src/' + pkg.name + '.js',
            debug: true
        })
        .transform(babelify, {presets: ['es2015']})
        .bundle()
        .pipe(source(pkg.name + '.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(header(banner, {pkg : pkg}))
  		.pipe(rename({suffix: '.standalone'}))
		.pipe(gulp.dest('dist/'));
});

gulp.task('js:es6', function() {
    return gulp.src('src/*.js')
        .pipe(plumber({errorHandler: onError}))
        .pipe(header(banner, {pkg : pkg}))
		.pipe(gulp.dest('dist/'));
});

gulp.task('js', ['js:es6', 'js:es5']);
// gulp.task('js', ['js:es6', 'js:es5-browserify']);

gulp.task('copy', function() {
    return gulp.src('./dist/*.js')
		.pipe(gulp.dest('./example/src/libs/'));
});

gulp.task('example:import', function(){
    return browserify({
            entries: './example/src/app.js',
            debug: true
        })
        .transform(babelify, {presets: ['es2015']})
        .bundle()
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe(gulp.dest('./example/js'));
});
gulp.task('example:async', function(){
    return gulp.src('./dist/*.js')
		.pipe(gulp.dest('./example/js/'));
});
gulp.task('example', ['example:import', 'example:async']);



gulp.task('server', ['js', 'copy', 'example'], function() {
    browserSync({
        notify: false,
        // https: true,
        server: ['example'],
        tunnel: false
    });

      gulp.watch(['src/*'], function(){
          runSequence('js', 'copy', 'example', reload);
      });
      gulp.watch(['example/**/*'], ['example', reload]);
      
});
 
gulp.task('deploy', ['example'], function() {
  return gulp.src('./example/**/*')
    .pipe(ghPages());
});


/************************
 *  Task API
 ************************/
gulp.task('default', ['server']);
gulp.task('serve', ['server']);
gulp.task('build', function() {
    runSequence('js', 'copy', 'example');
});