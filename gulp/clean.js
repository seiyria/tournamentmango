
const gulp = require('gulp');
const del = require('del');
const vinylPaths = require('vinyl-paths');

const getPaths = require('./_common').getPaths;

gulp.task('clean:libcss', () => gulp.src(getPaths().dist+'/css/lib.min.css').pipe(vinylPaths(del)));

gulp.task('clean:libjs', () => gulp.src(getPaths().dist+'/js/lib.min.js').pipe(vinylPaths(del)));

gulp.task('clean:css', () => gulp.src(getPaths().dist+'/css/main.min.css').pipe(vinylPaths(del)));

gulp.task('clean:js', () => gulp.src(getPaths().dist+'/js/main.min.js').pipe(vinylPaths(del)));

gulp.task('clean:all', ['clean:libcss', 'clean:libjs', 'clean:css', 'clean:js']);