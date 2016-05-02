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
  var dbPromise = new Promise(function(resolve, reject) {
    dbClient.connect(dbUrl, function (err, db) {
      var lists = db.collection('lists');
      lists.find({type: 'body-list'}).toArray(function (err, results) {
        var bodylist = results[0].body;
        db.close();
        resolve(bodylist);
      })
    });
  });
  dbPromise.then(function (bodylist) {
    dbClient.connect(dbUrl, function (err, db) {
      if (!err) {
        var collections = db.collection('collections');
        collections.find({email: req.currentUser.email}).toArray(function (err, results) {
          if (results.length>0) {
            var resPromise = new Promise(function(resolve, reject) {
              function findMatch(array, arrayCompare) {
                var found = [];
                _.each(array, function (item) {
                  for (var i = 0; i < arrayCompare.length; i++) {
                    if (item.item.categories[0].id === arrayCompare[i]) {
                      found.push(item);
                      break;
                    }
                  }
                })
                return found;
              }
              if (req.query.sort === 'date') {
                results = _.sortBy(results, 'date').reverse();
                resolve(results);
              }
              if (req.query.sort === 'cat') {
                results = _.sortBy(results, 'category').reverse();
                resolve(results);
              }
              if (req.query.sort === 'top') {
                results = findMatch(results, bodylist.top);
                resolve(results);
              }
              if (req.query.sort === 'bot') {
                results = findMatch(results, bodylist.bot);
                resolve(results);
              }
              if (req.query.sort === 'accessories') {
                results = findMatch(results, bodylist.ace);
                resolve(results);
              }
              if (req.query.sort === 'foot') {
                results = findMatch(results, bodylist.sho);
                resolve(results);
              }
              if (req.query.sort === 'fullbody') {
                results = findMatch(results, bodylist.ful);
                resolve(results);
              }
              if (req.query.sort === 'bags') {
                results = findMatch(results, bodylist.bag);
                resolve(results);
              }
              if (req.query.sort === 'eye') {
                results = findMatch(results, bodylist.eye);
                resolve(results);
              }
              if (req.query.sort === 'neck') {
                results = findMatch(results, bodylist.nec);
                resolve(results);
              }
              if (req.query.sort === 'head') {
                results = findMatch(results, bodylist.hed);
                resolve(results);
              }
            });
            resPromise.then(function (body) {
              res.json(body);
              db.close();
            })
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
    dbClient.connect(dbUrl, function (err, db) {
      if (!err) {
        var collections = db.collection('collections');
        collections.update({email: req.currentUser.email, item: {id: response.id }}, {
          $set: {
            item: response,
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
})

router.put('/update-withcat/:id', function (req, res) {
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
        }
      })
    })
  })
})

router.put('/remove/:id', function (req, res) {
  dbClient.connect(dbUrl, function (err, db) {
    if (!err) {
      var collections = db.collection('collections');
      collections.find({email: req.currentUser.email}).toArray(function (err, results) {
        var p1 = new Promise(function(resolve, reject) {
          for (var i = 0; i < results.length; i++) {
            if (results[i].item.id === parseInt(req.params.id)) {
              var matched = results[i];
            }
          }
          resolve(matched);
        });
        p1.then(function (matched) {
          collections.remove(matched, function (err, results) {
            res.sendStatus(200);
            db.close();
          })
        })
      });
    } else {
      res.sendStatus(404);
    }
  })
});

router.get('/update-lists', function (req, res) {
  var promise = new Promise(function(resolve, reject) {
    var p1 = new Promise(function(resolve, reject) {
      request('http://api.shopstyle.com/api/v2/categories?pid=uid41-33788821-64', function (err, res, body) {
        resolve(body);
      })
    });
    p1.then(function (body) {
      var top = [];
      var bot = [];
      var sho = [];
      var ful = [];
      var nec = [];
      var hed = [];
      var eye = [];
      var ace = [];
      var bag = [];

      var response = JSON.parse(body);
      var list = [];
      for (var i = 0; i < response.categories.length; i++) {
        list.push(response.categories[i].id);
      }
      _.each(list, function (item) {
        function push(item, category, kind) {
          if (item.indexOf(kind)>-1) {category.push(item)};
        }
        function remove(category, kind) {
          var position = category.indexOf(kind);
          if (position > -1) {
            category.splice(position, 1);
          }
        }
        push(item, top, 'tops');
        push(item, top, 'womens-clothes');
        push(item, top, 'mens-clothes');
        push(item, top, 'outerwear');
        push(item, top, 'sweaters');
        push(item, top, 'sweatshirts');
        push(item, top, 'jackets');

        push(item, bot, 'pants');
        push(item, bot, 'jeans');
        push(item, bot, 'skirts');

        push(item, sho, 'shoes');
        push(item, sho, 'boots');
        push(item, sho, 'flats');
        push(item, sho, 'pumps');
        push(item, sho, 'wedges');
        push(item, sho, 'sandals');
        push(item, sho, 'sneakers');

        push(item, ful, 'intimates');
        push(item, ful, 'suits');
        push(item, ful, 'dresses');
        push(item, ful, 'swimshirts');
        push(item, ful, 'bridal');
        remove(ful, 'bridal-shoes');

        push(item, ace, 'beauty');
        push(item, ace, 'mens-accessories');
        push(item, ace, 'womens-accessories');
        push(item, ace, 'jewelry');
        push(item, ace, 'jewelery');
        push(item, ace, 'diamond');
        push(item, ace, 'makeup');
        push(item, ace, 'wallets');
        push(item, ace, 'necklaces');
        push(item, ace, 'rings');
        push(item, ace, 'ring');
        push(item, ace, 'watches');

        push(item, bag, 'bags');
        push(item, bag, 'satchels');

        push(item, hed, 'caps');
        push(item, hed, 'hats');

        push(item, nec, 'necklaces');
        push(item, nec, 'scarves');

        push(item, eye, 'sunglasses');

      });
      var body = {
        top: _.uniq(top.sort()),
        bot: _.uniq(bot.sort()),
        sho: _.uniq(sho.sort()),
        ful: _.uniq(ful.sort()),
        bag: _.uniq(bag.sort()),
        ace: _.uniq(ace.sort()),
        hed: _.uniq(hed.sort()),
        nec: _.uniq(nec.sort()),
        eye: _.uniq(eye.sort()),
      }
      resolve(body);
    })
  });
  promise.then(function (body) {
    dbClient.connect(dbUrl, function (err, db) {
      var allLists = db.collection('lists');
      if (!err) {
        allLists.remove({}, function () {
          allLists.insert({type: 'body-list', body: body}, function (err, result) {
            db.close();
            res.json(body);
          })
        });
      } else {
        res.sendStatus(404);
      }
    })
  })
})

module.exports = router;
