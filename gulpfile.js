const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const fname = (process.argv[3] === '-f' && process.argv[4]) || '_default';
const replace = require('gulp-replace');
const rename = require('gulp-rename');

const processingDir = 'processingMocks';
const canvasDir = 'canvasMocks';

gulp.task('reload', () => {
    browserSync.reload();
});

gulp.task('p5bsync', () => {
    browserSync.init({
        server: {
            baseDir: processingDir,
            index: "index.html"
        }
    });
});

gulp.task('cvbsync', () => {
    browserSync.init({
        server: {
            baseDir: canvasDir,
            index: "index.html"
        }
    });
});

gulp.task('p5build', () => {
    gulp.src(`${processingDir}/_default.html`)
        .pipe(replace('__PDE__', fname))
        .pipe(rename({
            basename: 'index'
        }))
        .pipe(gulp.dest(`${processingDir}`))
});

gulp.task('p5', ['p5build', 'p5bsync'], () => {
    gulp.watch(`${processingDir}/**/*.pde`, ['p5build', 'reload']);
});

gulp.task('cvbuild', () => {
    gulp.src(`${canvasDir}/_default.html`)
        .pipe(replace('__SCRIPT__', fname))
        .pipe(rename({
            basename: 'index'
        }))
        .pipe(gulp.dest(`${canvasDir}`))
});

gulp.task('cv', ['cvbuild', 'cvbsync'], () => {
    gulp.watch(`${canvasDir}/**/*.js`, ['cvbuild', 'reload']);
    gulp.watch(`${canvasDir}/**/*.html`, ['cvbuild', 'reload']);
});