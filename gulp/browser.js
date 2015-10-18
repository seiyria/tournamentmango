
const _ = require('lodash');

const gulp = require('gulp');
const filter = require('gulp-filter');
const ghPages = require('gulp-gh-pages');

const browserSync = require('browser-sync').create();

const getPaths = require('./_common').getPaths;

gulp.task('deploy', () => {
  const paths = getPaths();
  return gulp.src(`${paths.dist}/**/*`, { base: paths.dist })
    .pipe(filter((file) => {
      return !_.contains(file.path, 'node_modules') && !_.contains(file.path, 'nw') && !_.contains(file.path, 'package');
    }))
    .pipe(ghPages());
});

gulp.task('reload', () => {
  browserSync.reload();
});

gulp.task('connect', ['build:all'], () => {
  browserSync.init({
    port: 8000,
    server: {
      baseDir: './dist'
    }
  });
});