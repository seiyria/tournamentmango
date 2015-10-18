
const gulp = require('gulp');
const git = require('gulp-git');
const bump = require('gulp-bump');
const filter = require('gulp-filter');
const tagVersion = require('gulp-tag-version');
const runSequence = require('run-sequence');

const currentTag = require('./_common').currentTag;

const versionSources = ['./bower.json', './package.json'];

const versionStream = (type) => {
  return gulp.src(versionSources)
    .pipe(bump({ type: type }))
    .pipe(gulp.dest('./'))
    .pipe(filter('package.json'))
    .pipe(tagVersion({ prefix: '' }));
};

const commitStream = (type) => {
  const tag = currentTag();
  return gulp.src(versionSources.concat('CHANGELOG.md'))
    .pipe(git.commit(`chore(version): release ${type} version ${tag}`, function() {
      git.push();
      git.push('origin', 'master', { args: '--tags' });
    }));
};

const pushStream = () => {
  git.push();
  git.push('origin', 'master', { args: '--tags' });
};

gulp.task('bump:patch:tag', () => versionStream('patch'));
gulp.task('bump:minor:tag', () => versionStream('minor'));
gulp.task('bump:major:tag', () => versionStream('major'));

gulp.task('bump:patch:commit', () => runSequence('bump:patch:tag', 'generate:changelog', () => commitStream('patch') && pushStream()));
gulp.task('bump:minor:commit', () => runSequence('bump:minor:tag', 'generate:changelog', () => commitStream('minor') && pushStream()));
gulp.task('bump:major:commit', () => runSequence('bump:major:tag', 'generate:changelog', () => commitStream('major') && pushStream()));