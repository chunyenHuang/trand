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

router.use(bodyParser.json());
router.use(cookieParser());

router.get('/', function (req, res) {
  dbClient.connect(dbUrl, function (err, db) {
    if (!err) {
      var combinations = db.collection('combinations');
      combinations.find({}).toArray(function (err, results) {
        if (results.length>0) {
          res.json(results);
          db.close();
        } else {
          res.sendStatus(404);
          db.close();
        }
      })
    } else {
      res.sendStatus(404);
    }
  });
})

router.get('/recent', function (req, res) {
  dbClient.connect(dbUrl, function (err, db) {
    if (!err) {
      var combinations = db.collection('combinations');
      combinations.find({}).toArray(function (err, results) {
        if (results.length>0) {
          var lastThree = [];
          for (var i = results.length-1; results.length-10 < i; i--) {
            lastThree.push(results[i]);
          }
          res.json(lastThree);
          db.close();
        } else {
          res.sendStatus(404);
          db.close();
        }
      })
    } else {
      res.sendStatus(404);
    }
  });
})


router.get('/detail/:id', function (req, res) {
  dbClient.connect(dbUrl, function (err, db) {
    if (!err) {
      var combinations = db.collection('combinations');
      combinations.find({_id: ObjectId(req.params.id)}).toArray(function (err, results) {
        if (results.length>0) {
          res.json(results[0]);
          db.close();
        } else {
          res.sendStatus(404);
          db.close();
        }
      })
    } else {
      res.sendStatus(404);
    }
  });
})

module.exports = router;
