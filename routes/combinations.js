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
      combinations.find({email: req.currentUser.email}).toArray(function (err, results) {
        if (results.length>0) {
          results = _.sortBy(results, 'date').reverse();
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

router.post('/new', function (req, res) {
  var items = req.body.combinations;
  var totalPrice = 0;
  var showed = _.where(items, {show: true});
  var totalPieces = showed.length;

  for (var i = 0; i < showed.length; i++) {
    totalPrice = totalPrice + showed[i].item.price;
  }

  var newComb = {
    email: req.currentUser.email,
    information: req.body.information,
    combinations: showed,
    price: totalPrice,
    pieces: totalPieces,
    date: new Date(),
  }

  dbClient.connect(dbUrl, function (err, db) {
    if (!err) {
      var combinations = db.collection('combinations');
      if (typeof(req.body.information._id)==='undefined') {
        combinations.insert(newComb, function (err, results) {
          res.status(201).send(results.ops[0]._id);
          db.close();
        })
      } else {
        combinations.update({_id: ObjectId(req.body.information._id)}, {
          $set: {
            price: totalPrice,
            pieces: totalPieces,
            information: req.body.information,
            combinations: showed,
            date: new Date(),
          }
        }, function (err, results) {
          res.status(200).send(req.body.information._id);
          db.close();
        })
      }
    } else {
      res.sendStatus(404);
    }
  })
})

router.put('/update', function (req, res) {
  var updateComb = {
    _id: req.body.id,
    combinations: req.body.combinations,
  }
  var items = req.body.combinations;
  var totalPrice = 0;
  var showed = _.where(items, {show: true});
  var totalPieces = showed.length;

  for (var i = 0; i < showed.length; i++) {
    totalPrice = totalPrice + showed[i].item.price;
  }
  dbClient.connect(dbUrl, function (err, db) {
    if (!err) {
      var combinations = db.collection('combinations');
      combinations.update({_id: {id: req.body.id }}, {
        $set: {
          price: totalPrice,
          pieces: totalPieces,
          combinations: req.body.combinations,
          date: new Date(),
        }
      }, {
          upsert: true,
        }, function (err, results) {
        res.sendStatus(200);
        db.close();
      })
    } else {
      res.sendStatus(404);
    }
  })
})

router.post('/update-img', function (req, res) {
  var updateComb = {
    date: new Date(),
  }
  if (req.body.type === 'large') {
    updateComb.largeUrl = req.body.largeUrl;
  }
  if (req.body.type === 'thumb') {
    updateComb.thumbUrl = req.body.thumbUrl;
  }

  dbClient.connect(dbUrl, function (err, db) {
    if (!err) {
      var combinations = db.collection('combinations');
      combinations.update({_id: ObjectId(req.body._id)}, {
        $set: updateComb }, {
          upsert: true,
        }, function (err, results) {
        res.sendStatus(200);
        db.close();
      })
    } else {
      res.sendStatus(404);
    }
  })
})

router.delete('/remove/:_id', function (req, res) {
  dbClient.connect(dbUrl, function (err, db) {
    if (!err) {
      var combinations = db.collection('combinations');
      combinations.remove({_id: ObjectId(req.params._id)}, function (err, result) {
        res.sendStatus(200);
        db.close;
      });
    } else {
      res.sendStatus(404);
    }
  })
});

router.delete('/remove-null/', function (req, res) {
  dbClient.connect(dbUrl, function (err, db) {
    if (!err) {
      var combinations = db.collection('combinations');
      combinations.remove({email: null }, function (err, result) {
        res.sendStatus(200);
        db.close;
      });
    } else {
      res.sendStatus(404);
    }
  })
});


module.exports = router;
