const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const fname = (process.argv[3] === '-f' && process.argv[4]) || '_default';
const replace = require('gulp-replace');
const rename = require('gulp-rename');

const processingDir = 'processingMocks';

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

gulp.task('p5build', () => {
    gulp.src(`${processingDir}/_default.html`)
        .pipe(replace('__PDE__', fname))
        .pipe(rename({
            basename: 'index'
        }))
        .pipe(gulp.dest(`processingMocks`))
});

gulp.task('p5', ['p5build', 'p5bsync'], () => {
    gulp.watch(`processingMocks/**/*.pde`, ['p5build', 'reload']);
});