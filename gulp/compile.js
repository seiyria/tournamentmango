
const gulp = require('gulp');
const util = require('gulp-util');
const concat = require('gulp-concat');
const minifyCss = require('gulp-minify-css');
const ngAnnotate = require('gulp-ng-annotate');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const gulpif = require('gulp-if');
const rename = require('gulp-rename');
const jade = require('gulp-jade');

const source = require('vinyl-source-stream');

const browserify = require('browserify');
const babelify = require('babelify');
const errorify = require('errorify');
const watchify = require('watchify');

const getPaths = require('./_common').getPaths;

gulp.task('compile:libcss', ['clean:libcss'], () => {
  return gulp.src(getPaths().libcss)
    // .pipe(cached('libcss'))
    // .pipe(remember('libcss'))
    .pipe(concat('lib.min.css'))
    .pipe(minifyCss({
      keepSpecialComments: false,
      removeEmpty: true
    }))
    .pipe(gulp.dest(getPaths().dist + 'css'))
    .on('error', util.log);
});

gulp.task('compile:libjs', ['clean:libjs'], () => {
  return gulp.src(getPaths().libjs)
    // .pipe(cached('libjs'))
    // .pipe(remember('libjs'))
    .pipe(concat('lib.min.js'))
    .pipe(gulp.dest(getPaths().dist + 'js'))
    .on('error', util.log);
});

let bundler = null;

gulp.task('compile:js', ['eslint', 'clean:js'], () => {

  const bundlee = function() {
    return bundler
      .bundle()
      .pipe(source('js/main.min.js'))
      .pipe(ngAnnotate())
      .pipe(gulp.dest(getPaths().dist))
      .on('error', util.log);
  };

  if(global.watching && bundler) return bundlee();

  bundler = browserify({
    cache: {}, packageCache: {}, fullPaths: true,
    entries: [getPaths().entry],
    debug: global.watching
  })
    .transform(babelify);

  if(global.watching) {
    bundler.plugin(errorify);
  }

  if (global.watching) {
    bundler = watchify(bundler);
    bundler.on('update', bundlee);
  }

  return bundlee();
});

gulp.task('compile:sass', ['clean:css'], () => {
  return gulp.src(getPaths().sass)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('css/main.css'))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulpif(!global.watching, minifyCss({
      keepSpecialComments: false,
      removeEmpty: true
    })))
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(getPaths().dist))
    .on('error', util.log);
});

gulp.task('compile:jade', () => {
  return gulp.src(getPaths().jade)
    .pipe(concat('index.html'))
    .pipe(jade({
      pretty: global.watching
    }))
    .pipe(gulp.dest(getPaths().dist))
    .on('error', util.log);
});

gulp.task('build:lib', ['compile:libjs', 'compile:libcss']);