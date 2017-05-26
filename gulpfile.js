// Dependencies
const gulp = require('gulp'),
	pkg = require('./package.json'),
	sass = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	header = require('gulp-header'),
	pixrem = require('gulp-pixrem'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	minifyCss = require('gulp-clean-css'),
	frontMatter = require('gulp-front-matter'),
	data = require('gulp-data'),
	sourcemaps = require('gulp-sourcemaps'),
	del = require('del'),
	browserSync = require('browser-sync'),
	reload = browserSync.reload,
	browserify = require('browserify'),
	imagemin = require('gulp-imagemin'),
	notify = require('gulp-notify'),
	plumber = require('gulp-plumber'),
	gulpIf = require('gulp-if'),
	babelify = require('babelify'),
	gulpUtil = require('gulp-util'),
	source = require('vinyl-source-stream'),
	buffer = require('vinyl-buffer'),
	runSequence = require('run-sequence'),
	nunjucksRender = require('gulp-nunjucks-render');

// Banner
const banner = [
	'/**',
	' * @name <%= pkg.name %>: <%= pkg.description %>',
	' * @version <%= pkg.version %>: <%= new Date().toUTCString() %>',
	' * @author <%= pkg.author %>',
	' * @license <%= pkg.license %>',
	' */'
].join('\n');

// Error notification
function onError(err) {
	notify.onError({
		title:    'Gulp',
		subtitle: 'Failure!',
		message:  'Error: <%= error.message %>',
		sound:    'Beep'
	})(err);

	this.emit('end');
}

//------------------------
// Configuration
//------------------------

// Autoprefixer settings
const AUTOPREFIXER_BROWSERS = [
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

// Build root destination / webroot for serve
const outputDir = './build';

// Asset destination base path
const assetPath = '/static';

// Paths for source and destinations
const paths = {
	src: {
		css: './src/scss/',
		js: './src/js/',
		html: './src/templates/',
		img: './src/img/',
		fonts: './src/fonts/'
	},
	dest: {
		css: `${outputDir}${assetPath}/css/`,
		js:  `${outputDir}${assetPath}/js/`,
		html: outputDir,
		img: `${outputDir}${assetPath}/img/`,
		fonts: `${outputDir}${assetPath}/fonts/`
	}
};

//------------------------
// Tasks
//------------------------

function clean() {
	return del(`${paths.dest}`);
}

function jsCore(){
	return browserify({
		entries: `${paths.src.js}app.js`,
		debug: !gulpUtil.env.production
	})
	.transform(babelify, {presets: ['es2015']})
	.bundle()
	.pipe(source('app.js'))
	.pipe(buffer())
	.pipe(gulpIf(!!gulpUtil.env.production, uglify()))
	.pipe(gulp.dest(paths.dest.js));
}

function jsAsync(){
	return gulp.src(`${paths.src.js}async/**/*`)
		.pipe(uglify())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest(`${paths.dest.js}async/`));
}

function jsPolyfills(){
	return browserify({
		entries: `${paths.src.js}polyfills/index.js`,
		debug: !gulpUtil.env.production
	})
	.bundle()
	.pipe(source('index.js'))
	.pipe(buffer())
	.pipe(uglify())
	.pipe(rename({
		basename: 'polyfills',
		suffix: '.min'
	}))
	.pipe(gulp.dest(`${paths.dest.js}async/`));
}

function html(){
	return gulp.src(`${paths.src.html}views/**/*.html`)
		.pipe(plumber({errorHandler: onError}))
		.pipe(frontMatter({ property: 'data' }))
		.pipe(data(() => {
			return {'assetPath': assetPath};
		}))
		.pipe(nunjucksRender({
			path: paths.src.html
		}))
		.pipe(gulp.dest(paths.dest.html));
}

function scss(){
	return gulp.src([`${paths.src.css}**/*.scss`, `!${paths.src.css}{fonts,kss}/*.*`])
		.pipe(plumber({errorHandler: onError}))
		.pipe(sourcemaps.init())
		.pipe(sass())
		.pipe(autoprefixer(AUTOPREFIXER_BROWSERS))
		.pipe(pixrem())
		.pipe(header(banner, {pkg : pkg}))
		.pipe(sourcemaps.write())
		.pipe(gulpIf(!!gulpUtil.env.production, minifyCss()))
		.pipe(gulp.dest(paths.dest.css));
}

function img(){
	return gulp.src(`${paths.src.img}**/*`)
		.pipe(imagemin({
			progressive: true,
			interlaced: true,
			svgoPlugins: [{removeViewBox: true}]
		}))
		.pipe(gulp.dest(paths.dest.img));
}

function fonts(){
	return gulp.src(`${paths.src.fonts}**/*.*`)
		.pipe(gulp.dest(paths.dest.fonts));
}

function serve(){
	browserSync({
		notify: false,
		// https: true,
		server: [outputDir],
		tunnel: false
	});
	watch(reload);
}

function watch(cb){
	const watchers = [
		{
			glob: `${paths.src.html}**/*.html`,
			tasks: ['html']
		},
		{
			glob: `${paths.src.css}**/*.scss`,
			tasks: ['scss']
		},
		{
			glob: `${paths.src.img}**/*`,
			tasks: ['img']
		},
		{
			glob: `${paths.src.js}**/*`,
			tasks: ['js']
		}
	];
	watchers.forEach(watcher => {
		cb && watcher.tasks.push(cb);
		gulp.watch(watcher.glob, watcher.tasks);
	});
}

//------------------------
// Gulp API
//------------------------
gulp.task('compile', () => {
	runSequence('clean', ['js', 'scss', 'img', 'html', 'fonts']);
});

gulp.task('jsCore', jsCore);
gulp.task('jsAsync', jsAsync);
gulp.task('jsPolyfills', jsPolyfills);

gulp.task('clean', clean);
gulp.task('js', ['jsCore', 'jsAsync', 'jsPolyfills']);
gulp.task('html', html);
gulp.task('scss', scss);
gulp.task('img', img);
gulp.task('fonts', fonts);
gulp.task('serve', () => {
	runSequence('clean', ['js', 'scss', 'img', 'html', 'fonts'], serve);
});
gulp.task('watch', watch);
gulp.task('default', ['serve']);
