
const gulp = require('gulp');
const git = require('gulp-git');
const bump = require('gulp-bump');
const filter = require('gulp-filter');
const tagVersion = require('gulp-tag-version');

const getPaths = require('./_common').getPaths;
const currentTag = require('./_common').currentTag;

const versionSources = ['./bower.json', './package.json'];

const versionStream = function(type) {
  return gulp.src(versionSources)
    .pipe(bump({ type: type }))
    .pipe(gulp.dest('./'))
    .pipe(filter('package.json'))
    .pipe(tagVersion({ prefix: '' }));
};

const commitStream = function(type) {
  var tag = currentTag();
  return gulp.src(versionSources.concat('CHANGELOG.md'))
    .pipe(git.commit('chore(version): release '+type+ ' version ' +tag, function() {
      git.push();
      git.push('origin', 'master', { args: '--tags' });
    }));
};

const pushStream = function() {
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