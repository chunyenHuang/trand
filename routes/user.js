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

router.use(bodyParser.json());
router.use(cookieParser());

router.get('/', function (req, res) {
  res.json(req.currentUser);
})

router.post('/login', function (req, res) {
  var token = sessionToken(50);
  dbClient.connect(dbUrl, function (err, db) {
    if (!err) {
      var users = db.collection('users');
      users.find({email: req.body.email, password: req.body.password}).toArray(function (err, results) {
        if (results.length>0) {
          users.update({email:req.body.email}, {$set: {token: token, loginCount: results[0].loginCount + 1}});
          res.cookie('trand2016', token);
          res.sendStatus(200);
          db.close();
        } else {
          res.sendStatus(403);
          db.close();
        }
      })
    } else {
      db.close();
    }
  })
})

router.get('/logout/:email', function (req, res) {
  dbClient.connect(dbUrl, function (err, db) {
    if (!err) {
      var users = db.collection('users');
      users.update({email: req.params.email}, {$set: {token: ' '}}, function (err, results) {
        res.clearCookie('trand2016');
        res.redirect('/fb/logout');
        db.close();
      })
    } else {
      res.sendStatus(404);
    }
  })
})

router.put('/update', function (req, res) {
  dbClient.connect(dbUrl, function (err, db) {
    if (!err) {
      var users = db.collection('users');
      users.update({email: req.body.email}, {$set: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
      }}, function (err, results) {
        res.sendStatus(200);
        db.close();
      })
    } else {
      res.sendStatus(404);
    }
  })
})

router.put('/img', function (req, res) {
  dbClient.connect(dbUrl, function (err, db) {
    if (!err) {
      var users = db.collection('users');
      users.update({email: req.currentUser.email},
        {$set: {img: req.body.url,}},
        {upsert: true,},
        function (err, results) {
        res.sendStatus(200);
        db.close();
      })
    } else {
      res.sendStatus(404);
    }
  })
})

router.post('/register', function (req, res) {
  var token = sessionToken(50);
  var newUser = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    registerDate: new Date(),
    token: token,
    loginCount: 1,
  }
  dbClient.connect(dbUrl, function (err, db) {
    if (!err) {
      var users = db.collection('users');
      users.insert(newUser, function () {
        res.cookie('trand2016', token);
        res.sendStatus(200);
        db.close;
      });
    } else {
      res.sendStatus(404);
    }
  })
});

router.delete('/resign/:email', function (req, res) {
  dbClient.connect(dbUrl, function (err, db) {
    if (!err) {
      var users = db.collection('users');
      users.remove({email: req.params.email}, function (err, result) {
        res.sendStatus(200);
        db.close;
      });
    } else {
      res.sendStatus(404);
    }
  })
});

module.exports = router;
