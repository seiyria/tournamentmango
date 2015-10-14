
const gulp = require('gulp');
const runSequence = require('run-sequence');

const getPaths = require('./_common').getPaths;

gulp.task('watch:sass', function() {
  global.watching = true;
  return gulp.watch(getPaths().sass, function() { runSequence('compile:sass', 'reload'); });
});

gulp.task('watch:jade', function() {
  global.watching = true;
  return gulp.watch(getPaths().jade, function() { runSequence('compile:jade', 'reload'); });
});

gulp.task('watch:js', function() {
  global.watching = true;
  return gulp.watch(getPaths().js, function() { runSequence('compile:js', 'reload'); });
});

gulp.task('watch:package', function() {
  global.watching = true;
  return gulp.watch('package.json', function() { runSequence('compile:libjs', 'compile:libcss', 'reload'); });
});

gulp.task('watch:all', ['watch:package', 'watch:sass', 'watch:jade', 'watch:js']);