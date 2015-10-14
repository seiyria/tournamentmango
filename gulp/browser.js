
const _ = require('lodash');

const gulp = require('gulp');
const util = require('gulp-util');
const filter = require('gulp-filter');
const connect = require('gulp-connect');
const open = require('gulp-open');
const ghPages = require('gulp-gh-pages');

const getPaths = require('./_common').getPaths;

gulp.task('deploy', function() {
  const paths = getPaths();

  return gulp.src(paths.dist+'/**/*', { base: paths.dist })
    .pipe(filter(function(file) {
      return !_.contains(file.path, 'node_modules') && !_.contains(file.path, 'nw') && !_.contains(file.path, 'package');
    }))
    .pipe(ghPages());
});

gulp.task('reload', function() {
  return gulp.src('dist/*.html')
    .pipe(connect.reload())
    .on('error', util.log);
});

gulp.task('connect', function() {
  connect.server({
    root: ['./dist'],
    port: 8000,
    livereload: true
  });
});

gulp.task('open', ['build:all'], function() {
  gulp.src('./dist/index.html')
    .pipe(open({
      uri: 'http://127.0.0.1:8000'
    }));
});