
const gulp = require('gulp');
const util = require('gulp-util');

const getPaths = require('./_common').getPaths;

gulp.task('copy:assets', () => {
  return gulp.src(getPaths().assets)
    .pipe(gulp.dest(`${getPaths().dist}/assets`));
});

gulp.task('copy:root', () => {
  return gulp.src(getPaths().root)
    .pipe(gulp.dest(getPaths().dist));
});

gulp.task('copy:dist', ['copy:assets', 'copy:root']);

gulp.task('copy:nw', () => {
  return gulp.src(['./package.json', 'nw-setup/**/*'])
    .pipe(gulp.dest(getPaths().dist))
    .on('error', util.log);
});