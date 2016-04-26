var express = require('express');
var router = express.Router();

var mongodb = require('mongodb');
var dbClient = mongodb.MongoClient;
var ObjectId = mongodb.ObjectId;
var database = 'trand';
var dbUrl = 'mongodb://localhost/' + database;

var request = require('request');
var _ = require('underscore');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

router.use(bodyParser.json());
router.use(cookieParser());

router.get('/', function (req, res) {
  dbClient.connect(dbUrl, function (err, db) {
    if (!err) {
      var collections = db.collection('collections');
      collections.find({email: req.currentUser.email}).toArray(function (err, results) {
        if (results.length>0) {
          res.json(results[0].collections);
          db.close();
        } else {
          res.sendStatus(404);
          db.close();
        }
      })
    } else {
      res.sendStatus(404);
      db.close();
    }
  });
})

router.put('/update', function (req, res) {
  dbClient.connect(dbUrl, function (err, db) {
    if (!err) {
      var collections = db.collection('collections');
      collections.update({email: req.currentUser.email}, {
        $addToSet: {
          collections: {
            date: new Date(),
            item: req.body,
          }
        }
      }, {
          upsert: true,
        }, function (err, results) {
        res.sendStatus(200);
        db.close();
      })
    } else {
      res.sendStatus(404);
      db.close();
    }
  })
})

router.delete('/delete', function (req, res) {
  dbClient.connect(dbUrl, function (err, db) {
    if (!err) {
      var users = db.collection('users');
      users.remove({email: req.params.email}, function (err, result) {
        res.sendStatus(200);
        db.close;
      });
    } else {
      res.sendStatus(404);
      db.close;
    }
  })
});

module.exports = router;
