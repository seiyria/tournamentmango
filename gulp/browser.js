
const _ = require('lodash');

const gulp = require('gulp');
const util = require('gulp-util');
const filter = require('gulp-filter');
const connect = require('gulp-connect');
const open = require('gulp-open');
const ghPages = require('gulp-gh-pages');

const getPaths = require('./_common').getPaths;

gulp.task('deploy', () => {
  return gulp.src(`${getPaths().dist}/**/*`, { base: paths.dist })
    .pipe(filter((file) => {
      return !_.contains(file.path, 'node_modules') && !_.contains(file.path, 'nw') && !_.contains(file.path, 'package');
    }))
    .pipe(ghPages());
});

gulp.task('reload', () => {
  return gulp.src('dist/*.html')
    .pipe(connect.reload())
    .on('error', util.log);
});

gulp.task('connect', () => {
  connect.server({
    root: ['./dist'],
    port: 8000,
    livereload: true
  });
});

gulp.task('open', ['build:all'], () => {
  gulp.src('./dist/index.html')
    .pipe(open({
      uri: 'http://127.0.0.1:8000'
    }));
});