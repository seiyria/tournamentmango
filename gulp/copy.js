
const gulp = require('gulp');
const util = require('gulp-util');

const getPaths = require('./_common').getPaths;

gulp.task('copy:dist', () => {
  return gulp.src(getPaths().favicon)
    .pipe(gulp.dest(getPaths().dist))
    .on('error', util.log);
});

gulp.task('copy:nw', () => {
  return gulp.src(['./package.json', 'nw-setup/**/*'])
    .pipe(gulp.dest(getPaths().dist))
    .on('error', util.log);
});