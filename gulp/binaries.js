
const gulp = require('gulp');
const util = require('gulp-util');
const zip = require('gulp-zip');
const release = require('gulp-github-release');
const folders = require('gulp-folders');
const nwBuilder = require('gulp-nw-builder');

const fs = require('fs');
const changelog = require('conventional-changelog');
const execSync = require('child_process').execSync;
const del = require('del');
const vinylPaths = require('vinyl-paths');

const getPaths = require('./_common').getPaths;
const currentTag = require('./_common').currentTag;

const binaryPath = () => getPaths().bin.build + '/OpenChallenge';

gulp.task('clean:binaries', () => {
  const paths = getPaths();

  return gulp.src([paths.bin.build, paths.bin.release])
    .pipe(vinylPaths(del))
    .on('error', util.log);
});

gulp.task('package:binaries', ['generate:binaries'], folders(binaryPath(), (folder) => {
  return gulp.src(`${binaryPath()}/${folder}/**/*`)
    .pipe(zip(`${folder}.zip`))
    .pipe(gulp.dest(getPaths().bin.release));
}));

gulp.task('upload:binaries', ['package:binaries'], () => {
  return gulp.src(`${getPaths().bin.release}/*.zip`)
    .pipe(release({
      repo: 'openchallenge',
      owner: 'seiyria',
      tag: currentTag(),
      manifest: require('../package.json')
    }));
});

gulp.task('generate:binaries', ['clean:binaries', 'copy:nw'], () => {
  execSync('npm install --prefix ./dist/ express');

  const paths = getPaths();

  return gulp.src(`${paths.dist}/**/*`)
    .pipe(nwBuilder({
      version: 'v0.12.2',
      platforms: ['osx64', 'win64', 'linux64'],
      appName: 'OpenChallenge',
      appVersion: currentTag(),
      buildDir: paths.bin.build,
      cacheDir: paths.bin.cache,
      macIcns: './favicon.icns',
      winIco: './favicon.ico'
    }));
});

gulp.task('generate:changelog', () => {
  return changelog({
    releaseCount: 0,
    preset: 'angular'
  })
    .pipe(fs.createWriteStream('CHANGELOG.md'));
});