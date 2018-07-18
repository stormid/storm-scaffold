// Dependencies
const config = require('./gulp.config');
const gulp = require('gulp');
const del = require('del');
const gulpUtil = require('gulp-util');
const sequence = require('run-sequence');

// const handleError = require('./utils').handleError;
const compileFromSCSS  = require('./css');
const compileImages  = require('./images');
const compileJS  = require('./js');
const compileHTML  = require('./html');
const ci  = require('./ci');


//------------------------
// Tasks
//------------------------
const clean = () => del([`${config.paths.public}`, `${config.paths.eject}`], { force: true });

const sw = () => gulp.src(`${config.paths.src.js}/sw/*.*`)
					.pipe(gulp.dest(`${config.paths.public}`));
					// .pipe(gulp.dest(config.paths.dest[!!gulpUtil.env.production ? 'production' : 'development'].html));





const staticAssets = eject => () => gulp.src(`${config.paths.src.staticAssets}/**/*`)
								.pipe(gulp.dest(`${eject ? config.paths.eject : config.paths.public}/${config.paths.staticAssets}`));



const watch = () => {
	gulp.watch([`${config.paths.src.css}/**/*.scss`], ['css']);
	gulp.watch(`${config.paths.src.js}/**/*`, ['js']);
	gulp.watch(`${config.paths.src.img}/**/*`, ['img']);
	gulp.watch(`${config.paths.src.staticAssets}/**/*`, ['staticAssets']);
};

//------------------------
// Gulp API
//------------------------

//optimise me pls...

//clean
gulp.task('clean', clean);


//css
gulp.task('css', compileFromSCSS(gulpUtil.env.production));
gulp.task('css:eject', compileFromSCSS(gulpUtil.env.production, true));

//img
gulp.task('img', compileImages());
gulp.task('img:eject', compileImages(true));

//static assets
gulp.task('staticAssets', staticAssets());
gulp.task('staticAssets:eject', staticAssets(true));

//html
gulp.task('html:eject', compileHTML);

//ci
gulp.task('ci:artefacts', ci.artefacts);
gulp.task('ci:sri', ci.sri);

//js
for(const subtask of ['core', 'standalone', 'polyfills', 'custom']) {
	gulp.task(`js:${subtask}`, compileJS[subtask](gulpUtil.env.production));
	gulp.task(`js:${subtask}:eject`, compileJS[subtask](gulpUtil.env.production, true));
}
gulp.task('js', () => {
	sequence('js:custom', ['js:core', 'js:standalone', 'js:polyfills']);
});
gulp.task('js:eject', () => {
	sequence('js:custom:eject', [
		'js:core:eject',
		'js:standalone:eject',
		'js:polyfills:eject'
	]);
});


//------------------------
// npm task interface
//------------------------
gulp.task('eject', () => {
	sequence('clean', ['css:eject', 'img:eject', 'staticAssets:eject', 'js:eject', 'html:eject']);
});
gulp.task('build', () => {
	sequence('clean', ['css', 'img', 'staticAssets', 'js']);
});
gulp.task('watch', () => { runSequence('build', watch); });

//-------

/*
gulp.task('compile', () => { runSequence('clean', ['jsCore', 'scss'], ['js-other', 'img', 'staticAssets']); });


gulp.task('sw', sw);

gulp.task('html', html);
// gulp.task('js-sri', () => { runSequence('jsCore', ['html']); })
// gulp.task('scss-sri', () => { runSequence('scss', ['html']); })
gulp.task('serve', () => { runSequence('clean', ['jsCore', 'scss'], ['js-other', 'img', 'staticAssets'], serve); });
gulp.task('watch', () => { runSequence('compile', watch); });
gulp.task('default', ['serve']);
*/