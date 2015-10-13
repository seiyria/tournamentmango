
require('babel/register');

var _ = require('lodash');

var gulp = require('gulp');
var del = require('del');
var source = require('vinyl-source-stream');
var vinylPaths = require('vinyl-paths');
var browserify = require('browserify');
var babelify = require('babelify');
var errorify = require('errorify');
var watchify = require('watchify');
var fs = require('fs');
var execSync = require('child_process').execSync;

var git = require('gulp-git');
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
var cached = require('gulp-cached');
var remember = require('gulp-remember');
var mocha = require('gulp-mocha');
var changelog = require('conventional-changelog');
var nwBuilder = require('gulp-nw-builder');
var zip = require('gulp-zip');
var folders = require('gulp-folders');
var release = require('gulp-github-release');
var packageJson = require('./package.json');

var watching = false;

var getPaths = function() {
  return JSON.parse(fs.readFileSync('./package.json')).gulp;
};

var currentTag = function() {
  return execSync('git describe --abbrev=0').toString().trim();
};

gulp.task('deploy', function() {
  var paths = getPaths();

  return gulp.src(paths.dist + '/(css|js|favicon.ico|index.html)')
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
    //.pipe(cached('libcss'))
    //.pipe(remember('libcss'))
    .pipe(concat('lib.min.css'))
    /*.pipe(uncss({
      html: paths.dist + 'index.html'
    }))*/
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
    //.pipe(cached('libjs'))
    //.pipe(remember('libjs'))
    //.pipe(gulpif(!watching, uglify({ outSourceMaps: false })))
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
      //.pipe(gulpif(!watching, uglify({ outSourceMaps: false })))
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
    /*.pipe(uncss({
      html: paths.dist + 'index.html'
    }))*/
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

var versionSources = ['./bower.json', './package.json'];

var versionStream = function(type) {
  return gulp.src(versionSources)
    .pipe(bump({ type: type }))
    .pipe(gulp.dest('./'))
    .pipe(filter('package.json'))
    .pipe(tagVersion({ prefix: 'v' }));
};

var commitStream = function(type) {
  var tag = currentTag();
  return gulp.src(versionSources.concat('CHANGELOG.md'))
    .pipe(git.commit('chore(version): release '+type+ ' version ' +tag, function() {
      git.push();
      git.push('origin', 'master', { args: '--tags' });
    }));
};

var pushStream = function() {
  git.push();
  git.push('origin', 'master', { args: '--tags' });
};

gulp.task('bump:patch:tag', function() {
  return versionStream('patch');
});

gulp.task('bump:minor:tag', function() {
  return versionStream('minor');
});

gulp.task('bump:major:tag', function() {
  return versionStream('major');
});

gulp.task('bump:patch:commit', ['bump:patch:tag', 'generate:changelog'], function() {
  return commitStream('patch') && pushStream();
});

gulp.task('bump:minor:commit', ['bump:minor:tag', 'generate:changelog'], function() {
  return commitStream('minor') && pushStream();
});

gulp.task('bump:major:commit', ['bump:major:tag', 'generate:changelog'], function() {
  return commitStream('major') && pushStream();
});

gulp.task('generate:changelog', function() {
  return changelog({
    releaseCount: 0,
    preset: 'angular'
  })
    .pipe(fs.createWriteStream('CHANGELOG.md'));
});

gulp.task('copy:nw', function() {
  var paths = getPaths();

  return gulp.src(['./package.json', 'nw-setup/**/*'])
    .pipe(gulp.dest(paths.dist))
    .on('error', util.log);
});

gulp.task('generate:binaries', ['clean:binaries', 'copy:nw'], function() {
  execSync('npm install --prefix ./dist/ express');
  var paths = getPaths();

  return gulp.src(paths.dist+'/**/*')
    .pipe(nwBuilder({
      version: 'v0.12.2',
      platforms: ['osx64', 'win64', 'linux64'],
      appName: packageJson.name,
      appVersion: packageJson.version,
      buildDir: './bin-build',
      cacheDir: './bin-cache',
      macIcns: './favicon.icns',
      winIco: './favicon.ico'
    }));
});

gulp.task('clean:binaries', function() {
  return gulp.src(['./bin-build', './bin-release'])
    .pipe(vinylPaths(del))
    .on('error', util.log);
});

var binaryPath = './bin-build/OpenChallenge';
gulp.task('package:binaries', ['generate:binaries'], folders(binaryPath, function(folder) {
  return gulp.src(binaryPath + '/' + folder + '/**/*')
    .pipe(zip(folder + '.zip'))
    .pipe(gulp.dest('./bin-release'));
}));

gulp.task('upload:binaries', ['package:binaries'], function() {
  return gulp.src('./bin-release/*.zip')
    .pipe(release({
      repo: 'openchallenge',
      owner: 'seiyria',
      tag: currentTag(),
      manifest: packageJson
    }));
});

gulp.task('test', function() {
  var paths = getPaths();

  gulp.src(paths.testjs)
    .pipe(mocha());
});

gulp.task('bump:patch', ['bump:patch:tag', 'bump:patch:commit']);
gulp.task('bump:minor', ['bump:minor:tag', 'bump:minor:commit']);
gulp.task('bump:major', ['bump:major:tag', 'bump:major:commit']);

gulp.task('release:patch', ['bump:patch', 'upload:binaries']);
gulp.task('release:minor', ['bump:minor', 'upload:binaries']);
gulp.task('release:major', ['bump:major', 'upload:binaries']);

gulp.task('default', ['build', 'connect', 'open', 'watch']);
gulp.task('build', ['clean', 'copy:favicon', 'build:libjs', 'build:libcss', 'compile']);
gulp.task('compile', ['compile:js', 'compile:sass', 'compile:jade']);
gulp.task('check', ['test', 'build']);
