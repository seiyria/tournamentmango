
const gulp = require('gulp');
const runSequence = require('run-sequence');

const getPaths = require('./_common').getPaths;

gulp.task('watch:sass', () => {
  global.watching = true;
  return gulp.watch(getPaths().sass, () => { runSequence('compile:sass', 'reload'); });
});

gulp.task('watch:jade', () => {
  global.watching = true;
  return gulp.watch(getPaths().jade, () => { runSequence('compile:jade', 'reload'); });
});

gulp.task('watch:js', () => {
  global.watching = true;
  return gulp.watch(getPaths().js, () => { runSequence('compile:js', 'reload'); });
});

gulp.task('watch:package', () => {
  global.watching = true;
  return gulp.watch('package.json', () => { runSequence('compile:libjs', 'compile:libcss', 'reload'); });
});

gulp.task('watch:all', ['watch:package', 'watch:sass', 'watch:jade', 'watch:js']);