const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const baseDir = 'processingMocks';
const fname = (process.argv[2] === '-f' && process.argv[3]) || '_default';
const replace = require('gulp-replace');
const rename = require('gulp-rename');

gulp.task('bsync', () => {
    browserSync.init({
        server: {
            baseDir,
            index: "index.html"
        }
    });
});

gulp.task('reload', () => {
    browserSync.reload();
});

gulp.task('p2build', () => {
    gulp.src(`${baseDir}/_default.html`)
        .pipe(replace('__PDE__', fname))
        .pipe(rename({
            basename: 'index'
        }))
        .pipe(gulp.dest(`${baseDir}`))
});

gulp.task('default', ['p2build', 'bsync'], () => {
    gulp.watch(`${baseDir}/**/*.pde`, ['p2build', 'reload']);
});