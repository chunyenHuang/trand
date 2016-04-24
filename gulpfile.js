var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var mocha = require('gulp-mocha');
var casperJs = require('gulp-casperjs');

gulp.task('test', function () {
  return gulp.src('app.spec.js', {read: false}).pipe(mocha());
})

gulp.task('casper', function () {
  gulp.src('casperTest.js')
    .pipe(casperJs());
});

gulp.task('go', function () {
  nodemon({script: 'app.js'}).on('start', ['casper', 'test']);
})

gulp.task('travis', ['test', 'casper']);
