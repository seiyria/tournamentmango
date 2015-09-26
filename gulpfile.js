
require('babel/register');

var gulp = require('gulp');
var del = require('del');
var source = require('vinyl-source-stream');
var vinylPaths = require('vinyl-paths');
var browserify = require('browserify');
var babelify = require('babelify');
var errorify = require('errorify');
var watchify = require('watchify');
var fs = require('fs');

var util = require('gulp-util');
var open = require('gulp-open');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var minifyCss = require('gulp-minify-css');
var streamify = require('gulp-streamify');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var jade = require('gulp-jade');
var sourcemaps = require('gulp-sourcemaps');
var connect = require('gulp-connect');
var gulpif = require('gulp-if');
var ghPages = require('gulp-gh-pages');
var bump = require('gulp-bump');
var tagVersion = require('gulp-tag-version');
var filter = require('gulp-filter');
var ngAnnotate = require('gulp-ng-annotate');
var uncss = require('gulp-uncss');
var eslint = require('gulp-eslint');
var autoprefixer = require('gulp-autoprefixer');
var changed = require('gulp-changed');
var mocha = require('gulp-mocha');

var watching = false;

var getPaths = function() {
  return JSON.parse(fs.readFileSync('./package.json')).gulp;
};

gulp.task('deploy', function() {
  var paths = getPaths();

  return gulp.src(paths.dist + '**/*')
    .pipe(ghPages());
});

gulp.task('clean', function() {
  var paths = getPaths();

  return gulp.src(paths.dist)
    .pipe(vinylPaths(del))
    .on('error', util.log);
});

gulp.task('copy:favicon', ['clean'], function() {
  var paths = getPaths();

  return gulp.src(paths.favicon)
    .pipe(gulp.dest(paths.dist))
    .on('error', util.log);
});

gulp.task('build:libcss', ['clean', 'compile:jade', 'compile:sass'], function() {
  var paths = getPaths();

  return gulp.src(paths.libcss)
    .pipe(changed(paths.dist))
    .pipe(concat('lib.min.css'))
    .pipe(uncss({
      html: paths.dist + 'index.html'
    }))
    .pipe(minifyCss({
      keepSpecialComments: false,
      removeEmpty: true
    }))
    .pipe(gulp.dest(paths.dist + 'css'))
    .on('error', util.log);
});

gulp.task('build:libjs', ['clean'], function() {
  var paths = getPaths();

  return gulp.src(paths.libjs)
    .pipe(changed(paths.dist))
    .pipe(gulpif(!watching, uglify({ outSourceMaps: false })))
    .pipe(concat('lib.min.js'))
    .pipe(gulp.dest(paths.dist + 'js'))
    .on('error', util.log);
});

gulp.task('compile:js', ['eslint', 'clean'], function() {
  var paths = getPaths();

  var bundler = browserify({
    cache: {}, packageCache: {}, fullPaths: true,
    entries: [paths.entry],
    debug: watching
  })
    .transform(babelify);

  if(watching) {
    bundler.plugin(errorify);
  }

  var bundlee = function() {
    return bundler
      .bundle()
      .pipe(source('js/main.min.js'))
      .pipe(gulpif(!watching, streamify(uglify({ outSourceMaps: false }))))
      .pipe(ngAnnotate())
      .pipe(gulp.dest(paths.dist))
      .on('error', util.log);
  };

  if (watching) {
    bundler = watchify(bundler);
    bundler.on('update', bundlee);
  }

  return bundlee();
});

gulp.task('eslint', function() {
  var paths = getPaths();

  return gulp.src(paths.js)
    .pipe(changed(paths.dist))
    .pipe(eslint({ useEslintrc: true }))
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

gulp.task('compile:sass', ['clean', 'compile:jade'], function() {
  var paths = getPaths();

  return gulp.src(paths.sass)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('css/main.css'))
    .pipe(uncss({
      html: paths.dist + 'index.html'
    }))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulpif(!watching, minifyCss({
      keepSpecialComments: false,
      removeEmpty: true
    })))
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.dist))
    .on('error', util.log);
});

gulp.task('compile:jade', ['clean'], function() {
  var paths = getPaths();

  return gulp.src(paths.jade)
    .pipe(concat('index.html'))
    .pipe(jade({
      pretty: watching
    }))
    .pipe(gulp.dest(paths.dist))
    .on('error', util.log);
});

gulp.task('reload', ['build'], function() {
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

gulp.task('open', ['build'], function() {
  gulp.src('./dist/index.html')
    .pipe(open({
      uri: 'http://127.0.0.1:8000'
    }));
});

gulp.task('watch', function() {
  var paths = getPaths();

  watching = true;
  return gulp.watch([paths.sass, paths.jade, paths.js, 'package.json'], ['reload']);
});

gulp.task('bump:patch', function() {
  gulp.src(['./bower.json', './package.json'])
    .pipe(bump({ type: 'patch' }))
    .pipe(gulp.dest('./'))
    .pipe(filter('package.json'))
    .pipe(tagVersion({ prefix: '' }));
});

gulp.task('bump:minor', function() {
  gulp.src(['./bower.json', './package.json'])
    .pipe(bump({ type: 'minor' }))
    .pipe(gulp.dest('./'))
    .pipe(filter('package.json'))
    .pipe(tagVersion({ prefix: '' }));
});

gulp.task('bump:major', function() {
  gulp.src(['./bower.json', './package.json'])
    .pipe(bump({ type: 'major' }))
    .pipe(gulp.dest('./'))
    .pipe(filter('package.json'))
    .pipe(tagVersion({ prefix: '' }));
});

gulp.task('test', function() {
  var paths = getPaths();

  gulp.src(paths.testjs)
    .pipe(mocha());
});

gulp.task('default', ['build', 'connect', 'open', 'watch']);
gulp.task('build', ['clean', 'copy:favicon', 'build:libjs', 'build:libcss', 'compile']);
gulp.task('compile', ['compile:js', 'compile:sass', 'compile:jade']);
gulp.task('check', ['test', 'build']);
