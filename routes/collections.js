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
          results[0].collections = _.sortBy(results[0].collections, 'date').reverse();
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

router.get('/item/:id', function (req, res) {
  console.log(parseInt(req.params.id));
  var p1 = new Promise(function(resolve, reject) {
    request('http://api.shopstyle.com/api/v2/products/' + parseInt(req.params.id) + '?pid=uid41-33788821-64', function (err, res, body) {
      resolve(body);
    })
  });
  p1.then(function (body) {
    var response = JSON.parse(body);
    res.json(response);
  })
})

router.put('/update/:id', function (req, res) {
  dbClient.connect(dbUrl, function (err, db) {
    if (!err) {
      var collections = db.collection('collections');
      collections.update({email: req.currentUser.email}, {
        $addToSet: {
          collections: {
            itemId: req.params.id,
          }
        }
      }, {
          upsert: true,
        }, function (err, results) {
        console.log('add'+ req.params.id);
        res.sendStatus(200);
        db.close();
      })
    } else {
      res.sendStatus(404);
      db.close();
    }
  })
})

router.put('/remove/:id', function (req, res) {
  dbClient.connect(dbUrl, function (err, db) {
    if (!err) {
      var collections = db.collection('collections');
      collections.update({email: req.currentUser.email}, {
        $pull: {
          collections: {
            itemId: req.params.id,
          }
        }
      }, function (err, result) {
        console.log('remove' + req.params.id);
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
