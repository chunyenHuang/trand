var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var mocha = require('gulp-mocha');
var casperJs = require('gulp-casperjs');
var app = require('./app.js');
var htmlmin = require('gulp-htmlmin');
var csso = require('gulp-csso');
var server = '';
var s3 = require('gulp-s3-upload')(config);
var sass = require('gulp-sass');

var homedir = {
  public: './public',
  assets: './public/assets',
  min: './min',
}

var AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
var AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
var S3_BUCKET = process.env.S3_BUCKET_NAME;

var config = {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
}

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
      // .on('start', ['routes', 'casper'])

  var watcherCSS = gulp.watch('./public/**/*.css', ['minifyCSS', 'upload_s3']);
  watcherCSS.on('change', function(event){
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  })
  var watcherJS = gulp.watch('./public/**/*.js', ['copyJS', 'upload_s3']);
  var watcherSCSS = gulp.watch('./public/assets/scss/*.scss', ['sass']);
  var watcherSCSS = gulp.watch('./public/assets/scss/**/*.scss', ['sass']);
})

// Travis
gulp.task('test', ['go'], function () {
  setTimeout(function () {
    return process.exit();
  }, 10000);
});
gulp.task('minifyCSS', function(){
  return gulp.src('./public/**/*.css')
          .pipe(csso())
          .pipe(gulp.dest(homedir.min));
})
gulp.task('copyJS', function(){
  return gulp.src('./public/**/*.js')
          .pipe(gulp.dest(homedir.min));
})
gulp.task("upload_s3", function() {
  return  gulp.src("./min/**")
            .pipe(s3({
                Bucket: S3_BUCKET + '/site',
                ACL: 'public-read',
            }));
});

gulp.task('sass', function() {
  return gulp.src('./public/assets/scss/*.scss')
              .pipe(sass().on('error', sass.logError))
              .pipe(gulp.dest('./public/assets'))
})
