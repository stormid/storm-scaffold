// Dependencies
const config = require('./tools/gulp.config');
const gulp = require('gulp');
const del = require('del');
const fs = require('fs');
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

const reload = done => {
    browserSync.reload();
    done();
};

const clean = () => del([`${config.paths.build}`, `${config.paths.artefacts}`], { force: true });

gulp.task('staticAssets', () =>
    gulp
        .src(`${config.paths.src.staticAssets}/**/*`)
        .pipe(gulp.dest(`${config.paths.build}/${config.paths.assets}`))
);

gulp.task('robots', cb => {
    fs.writeFile(`${config.paths.build}/robots.txt`, 'User-agent: *\nDisallow: /', cb);
});

// const sw = () => gulp.src(`${config.paths.src.js}/sw/*.*`)
// 					.pipe(gulp.dest(`${config.paths.public}`));
// 					// .pipe(gulp.dest(config.paths.dest[!!gulpUtil.env.production ? 'production' : 'development'].html));

function watch(reload) {
    gulp.watch(`${config.paths.src.css}/**/*.scss`, gulp.series('css', reload));
    gulp.watch(`${config.paths.src.js}/**/*`, gulp.series('js', reload));
    gulp.watch(`${config.paths.src.img}/**/*`, gulp.series('img', reload));
    gulp.watch(`${config.paths.src.html}/**/*`, gulp.series('html', reload));
}

const browserSyncConfig = {
    notify: false,
    // https: true,
    server: [config.paths.build],
    tunnel: false
};

function serve() {
    browserSync(browserSyncConfig);
    watch(reload);
}

gulp.task('ci', gulp.parallel('robots', 'ci:artefacts', 'ci:sri'));

gulp.task('assets', gulp.series('js', 'css', 'html', 'img', 'staticAssets'));

gulp.task('build', gulp.series(clean, 'assets'));

gulp.task('serve', gulp.series('build', serve));

gulp.task('compile', gulp.series('assets', 'ci'));

gulp.task('watch', gulp.series('build', watch));
