var express = require('express');
var router = express.Router();

var mongodb = require('mongodb');
var dbClient = mongodb.MongoClient;
var ObjectId = mongodb.ObjectId;
var dbUrl = process.env.MONGODB_URI || 'mongodb://localhost/trand'

var request = require('request');
var _ = require('underscore');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

function sessionToken(length){
  var token = "";
  var possible = "abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for(var x=0; x < length; x++){
    token += possible.charAt(Math.floor(Math.random() * possible.length)+1);
  }
  return token;
}

router.use(cookieParser());

router.use(function (req, res, next) {
  dbClient.connect(dbUrl, function (err, db) {
    if (!err) {
      var users = db.collection('users');
      users.find({token: req.cookies.trand2016}).toArray(function (err, results) {
        if (results.length>0) {
          req.currentUser = results[0];
        } else {
          req.currentUser = {
            firstName: 'guest'
          };
        }
        db.close();
        next();
      })
    } else {
      next();
    }
  })
});

module.exports = router;
