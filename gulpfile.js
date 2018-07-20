// Dependencies
const config = require('./tools/gulp.config');
const gulp = require('gulp');
const del = require('del');
const gulpUtil = require('gulp-util');
const sequence = require('run-sequence');
const browserSync = require('browser-sync');

// Tooling fns
const compileCSS  = require('./tools/css');
const compileImg  = require('./tools/img');
const compileHTML  = require('./tools/html');
const compileJS  = require('./tools/js');
const ci  = require('./tools/ci');


//------------------------
// Tasks
//------------------------
const clean = () => del([`${config.paths.build}`, `${config.paths.artefacts}`], { force: true });

// const sw = () => gulp.src(`${config.paths.src.js}/sw/*.*`)
// 					.pipe(gulp.dest(`${config.paths.public}`));
// 					// .pipe(gulp.dest(config.paths.dest[!!gulpUtil.env.production ? 'production' : 'development'].html));


const staticAssets = () => () => gulp.src(`${config.paths.src.staticAssets}/**/*`).pipe(gulp.dest(`${config.paths.build}/${config.paths.assets}`));

const watch = () => {
	gulp.watch([`${config.paths.src.css}/**/*.scss`], () => {
		sequence('css', browserSync.reload);
	});
	gulp.watch(`${config.paths.src.js}/**/*`, () => {
		sequence('js', browserSync.reload);
	});
	gulp.watch(`${config.paths.src.img}/**/*`, () => {
		sequence('img', browserSync.reload);
	});
	gulp.watch(`${config.paths.src.html}/**/*`, () => {
		sequence('html', browserSync.reload);
	});
};

function serve(){
	browserSync({
		notify: false,
		// https: true,
		server: [config.paths.build],
		tunnel: false
	});
	watch(browserSync.reload);
}

//------------------------
// Gulp API
//------------------------
gulp.task('clean', clean);
gulp.task('css', compileCSS(gulpUtil.env.production));
gulp.task('img', compileImg());
gulp.task('html', compileHTML);
gulp.task('staticAssets', staticAssets());
gulp.task('ci:artefacts', ci.artefacts);
gulp.task('ci:sri', ci.sri);
for(const subtask of ['core', 'standalone', 'polyfills', 'custom']) {
	gulp.task(`js:${subtask}`, compileJS[subtask](gulpUtil.env.production));
}
gulp.task('js', () => {
	sequence('js:custom', ['js:core', 'js:standalone', 'js:polyfills']);
});
gulp.task('serve', () => {
	sequence('clean', ['css', 'html', 'img', 'staticAssets', 'js'], serve);
});
//------------------------
// npm task interface
//------------------------
gulp.task('build', () => {
	sequence('clean', ['css', 'html', 'img', 'staticAssets', 'js']);
});
// gulp.task('watch', () => { sequence('build', watch); });
gulp.task('ci', () => { 
	sequence('clean', ['css', 'html', 'img', 'staticAssets', 'js'], ['ci:sri', 'ci:artefacts']);
});


/*
gulp.task('sw', sw);
gulp.task('default', ['serve']);
*/