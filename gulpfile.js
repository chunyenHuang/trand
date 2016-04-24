var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var mocha = require('gulp-mocha');
var casperJs = require('gulp-casperjs');
var app = require('./app.js');
var server = '';

// Real time
gulp.task('routes', function () {
  return gulp.src('app.spec.js', {read: false}).pipe(mocha());
})

gulp.task('casper', function () {
  gulp.src('casperTest.js')
    .pipe(casperJs());
});

gulp.task('go', function () {
  nodemon({script: 'app.js'})
      .on('start', ['routes', 'casper'])
})

// Travis
gulp.task('test', ['go'], function () {
  setTimeout(function () {
    return process.exit();
  }, 100);
});
