var express = require('express');
var router = express.Router();

var request = require('request');
var _ = require('underscore');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var http = require('http');
var path = require('path');
var aws = require('aws-sdk');
var fs = require('fs');
var rimraf = require('rimraf');
var mkdirp = require('mkdirp');

router.use(cookieParser());

router.use(bodyParser.json());
// router.use(bodyParser.urlencoded({ extended: true }));

var AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
var AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
var S3_BUCKET = process.env.S3_BUCKET_NAME;
console.log(AWS_ACCESS_KEY_ID);
console.log(AWS_SECRET_ACCESS_KEY);
console.log(S3_BUCKET);

router.post('/sign_s3', function (req, res) {
  aws.config.update({accessKeyId: AWS_ACCESS_KEY_ID, secretAccessKey: AWS_SECRET_ACCESS_KEY});
  var s3 = new aws.S3();
  var s3_params = {
      Bucket: S3_BUCKET + '/ideas',
      Key: req.body.file_name,
      Expires: 600,
      ContentType: req.body.file_type,
      ACL: 'public-read',
  };
  console.log(s3);
  console.log(s3_params);
  s3.getSignedUrl('putObject', s3_params, function(err, data){
    if(err){
        console.log(err);
    }
    else{
      var p1 = new Promise(function(resolve, reject) {
        var return_data = {
            signed_request: data,
            url: 'https://s3.amazonaws.com/'+ S3_BUCKET + '/' + req.body.file_name,
        };
        resolve(return_data);
      });
      p1.then(function (body) {
        res.json(body);
      })
    }
  });
})

router.post('/tmp', function (req, res) {
  var origin = req.body;
  var dir = './public/tmp/' + req.currentUser.email + '/';
  mkdirp(dir, function(err) {
    getAndSaveRecursive(origin, 0);
    function getAndSaveRecursive(array, i) {
      if (i<array.length) {
        var name = array[i].name;
        var url = array[i].src
        var p1 = new Promise(function(resolve, reject) {
          request(url, {encoding: 'binary'}, function(error, response, body) {
            fs.writeFile(dir + name + '.jpg', body, 'binary', function () {
              fs.readFile(dir + name + '.jpg', function(err, data) {
                resolve();
              })
            });
          });
        });
        p1.then(function () {
          console.log(name + '.jpg is saved to ' + dir);
          i++;
          getAndSaveRecursive(array, i);
        })
      } else {
        console.log('all done');
        var saved = origin;
        for (var i = 0; i < saved.length; i++) {
          saved[i].src = 'tmp/' + req.currentUser.email + '/' + origin[i].name + '.jpg';
        }
        res.json(saved);
      }
    }
  })
})

router.delete('/tmp', function (req, res) {
  rimraf('./public/tmp/' + req.currentUser.email, function () {
    console.log('remove ./public/tmp/'+req.currentUser.email);
  })
  res.sendStatus(200);
})

function upload_file(signed_request, url){
  var p1 = new Promise(function(resolve, reject) {
    request({
      method: 'PUT',
      url: signed_request,
      data: 'TTTTTT',
      headers: {
        'x-amz-acl': 'public-read',
        'content-type': 'image/png',
      },
    }, function (err, body, res) {
      resolve(res);
      reject(err);
    })
  });
  p1.then(function (res) {
    console.log(res);
  }, function (err) {
    console.log(err);
  })
}

module.exports = router;
