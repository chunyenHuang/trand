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
          if (req.query.sort == 'category') {
            results = _.sortBy(results, 'category').reverse();
            console.log('sort by category');
          }
          if (req.query.sort == 'date') {
            results = _.sortBy(results, 'date').reverse();
            console.log('sort by date');

          }
          res.json(results);
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
  var p1 = new Promise(function(resolve, reject) {
    request('http://api.shopstyle.com/api/v2/products/' + parseInt(req.params.id) + '?pid=uid41-33788821-64', function (err, res, body) {
      resolve(body);
    })
  });
  p1.then(function (body) {
    var response = JSON.parse(body);
    var p2 = new Promise(function(resolve, reject) {
      request('http://api.shopstyle.com/api/v2/categories?pid=uid41-33788821-64' + '&cat=' + response.categories[0].id, function (err, res, body) {
        resolve(body);
      })
    });
    p2.then(function (body) {
      var categoriesJSON = JSON.parse(body);
      var category = categoriesJSON.metadata.root.parentId;
      dbClient.connect(dbUrl, function (err, db) {
        if (!err) {
          var collections = db.collection('collections');
          collections.update({email: req.currentUser.email, item: {id: response.id }}, {
            $set: {
              item: response,
              date: new Date(),
              category: category,
              body: 'body',
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
  })
})

router.put('/remove/:id', function (req, res) {
  dbClient.connect(dbUrl, function (err, db) {
    if (!err) {
      var collections = db.collection('collections');
      collections.remove({email: req.currentUser.email, item: {id: parseInt(req.params.id) }}, function (err, result) {
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
