
const gulp = require('gulp');
const eslint = require('gulp-eslint');

const getPaths = require('./_common').getPaths;

gulp.task('eslint', () => {
  return gulp.src(getPaths().js)
    .pipe(eslint({ useEslintrc: true }))
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});