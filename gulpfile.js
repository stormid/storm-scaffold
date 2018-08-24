// Dependencies
const config = require('./tools/gulp.config');
const gulp = require('gulp');
const del = require('del');
const fs = require('fs');
const sequence = require('run-sequence');
const browserSync = require('browser-sync');

//gulp css
require('./tools/css');

//gulp img
require('./tools/img');

// gulp html
require('./tools/html');

// gulp js
require('./tools/js');

// gulp ci:sri, ci:artefacts
require('./tools/ci');

gulp.task('clean', () => del([`${config.paths.build}`, `${config.paths.artefacts}`], { force: true }));

gulp.task('staticAssets', () => gulp.src(`${config.paths.src.staticAssets}/**/*`).pipe(gulp.dest(`${config.paths.build}/${config.paths.assets}`)));

gulp.task('robots', cb => {
	fs.writeFile(`${config.paths.build}/robots.txt`, 'User-agent: *\nDisallow: /', cb);
});

// const sw = () => gulp.src(`${config.paths.src.js}/sw/*.*`)
// 					.pipe(gulp.dest(`${config.paths.public}`));
// 					// .pipe(gulp.dest(config.paths.dest[!!gulpUtil.env.production ? 'production' : 'development'].html));


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

gulp.task('serve', () => {
	sequence('clean', ['css', 'html', 'img', 'staticAssets', 'js'], () => {
		browserSync({
			notify: false,
			// https: true,
			server: [config.paths.build],
			tunnel: false
		});
		watch();
	});
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

//------------------------
// npm task interface
//------------------------
gulp.task('compile', () => {
	sequence('clean', ['css', 'html', 'img', 'staticAssets', 'js'], ['ci:sri', 'robots', 'ci:artefacts']);
});
gulp.task('build', () => {
	sequence('clean', ['css', 'html', 'img', 'staticAssets', 'js']);
});
gulp.task('watch', () => { sequence('build', watch); });