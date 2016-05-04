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

router.use(cookieParser());

router.use(bodyParser.json());
router.use(bodyParser.urlencoded())

var AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
var AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
var S3_BUCKET = process.env.S3_BUCKET_NAME;
console.log(AWS_ACCESS_KEY_ID);
console.log(AWS_SECRET_ACCESS_KEY);
console.log(S3_BUCKET);

router.get('/sign_s3', function (req, res) {
  aws.config.update({accessKeyId: AWS_ACCESS_KEY_ID, secretAccessKey: AWS_SECRET_ACCESS_KEY});
  var s3 = new aws.S3();
  var s3_params = {
      Bucket: S3_BUCKET,
      Key: req.query.file_name,
      Expires: 60,
      ContentType: req.query.file_type,
      ACL: 'public-read'
  };
  s3.getSignedUrl('putObject', s3_params, function(err, data){
    if(err){
        console.log(err);
    }
    else{
        var return_data = {
            signed_request: data,
            url: 'https://s3.amazonaws.com/'+ S3_BUCKET + '/' + req.query.file_name
        };
        console.log(return_data);

        upload_file('qqqqq', return_data.signed_request, return_data.url);
        res.json(return_data);
        res.end();
    }
  });
})

function stream() {
  var url = "https://resources.shopstyle.com/pim/da/95/da9553ccc96eb3356f14b3b223428191_best.jpg";
  var p1 = new Promise(function(resolve, reject) {
    request(url, {encoding: 'binary'}, function(error, response, body) {
      fs.writeFile('downloaded.jpg', body, 'binary', function () {
        fs.readFile('downloaded.jpg', function(err, data) {
          resolve(data);
        })
      });
    });
  });
  p1.then(function (body) {
    // res.header('Content-type', 'image/jpg');
    return body;
  })
}

router.get('/download-test', function (req, res) {
  var url = "https://resources.shopstyle.com/pim/da/95/da9553ccc96eb3356f14b3b223428191_best.jpg";
  aws.config.update({accessKeyId: AWS_ACCESS_KEY_ID, secretAccessKey: AWS_SECRET_ACCESS_KEY});
  var s3 = new aws.S3();
  var s3_params = {
    Bucket: S3_BUCKET,
    Key: '111',
    Expires: 60,
    ContentType: 'image/jpeg',
    ACL: 'public-read'
  };
  console.log(s3_params);
  s3.getSignedUrl('putObject', s3_params, function(err, data){
    if(err){
      console.log(err);
    }
    else{
      var return_data = {
        signed_request: data,
        url: 'https://s3.amazonaws.com/'+ S3_BUCKET + '/' + 'XXXXX'
      };
      var p1 = new Promise(function(resolve, reject) {
        request(url, {encoding: 'binary'}, function(error, response, body) {
          fs.writeFile('downloaded.jpg', body, 'binary', function () {
            fs.readFile('downloaded.jpg', function(err, data) {
              resolve(data);
            })
          });
        });
      });
      p1.then(function (body) {
        console.log(body);
        console.log(typeof(body));
        upload_file(body, return_data.signed_request, return_data.url);
        // res.sendStatus(200);
        res.header('Content-type', 'image/jpeg');
        res.send(body);
      })
      // res.json(return_data);
      // res.end();
    }
  });

})

function upload_file(file, signed_request, url){
  var p1 = new Promise(function(resolve, reject) {
    request({
      method: 'PUT',
      url: signed_request,
      headers: {
        'x-amz-acl': 'public-read',
        'Content-Type': 'image/jpg',
      },
      data: file,
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
