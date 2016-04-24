// Express
var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
// Database
var mongodb = require('mongodb');
var dbClient = mongodb.MongoClient;
var ObjectId = mongodb.ObjectId;
var database = 'trand';
var dbUrl = 'mongodb://localhost/' + database;
// Routes
var api = require('./routes/api');
// Module Tools
var request = require('request');
var _ = require('underscore');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var sessions = [];
function sessionToken(length){
  var token = "";
  var possible = "abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for(var x=0; x < length; x++){
    token += possible.charAt(Math.floor(Math.random() * possible.length)+1);
  }
  return token;
}

app.use(bodyParser.json());
app.use(cookieParser());
app.use(function (req, res, next) {
  var matched = _.where(sessions, {token: req.cookies.todo});
  if (matched.length>0){
    req.username = matched[0].username;
  }
  next();
});
app.use('/api', api);
app.use(express.static('./public/'));

app.post('/register', function (req, res) {
  var newUser = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    registerDate: new Date(),
  }
  dbClient.connect(dbUrl, function (err, db) {
    if (!err) {
      var users = db.collection('users');
      users.insert(newUser, function () {
        users.find(newUser).toArray(function (err, result) {
          res.sendStatus(200);
          db.close;
        });
      });
    } else {
      res.sendStatus(404);
      db.close;
    }
  })
});
app.delete('/resign/:email', function (req, res) {
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

if (!require.main.loaded) {
  app.listen(port, function () {
    console.log('running on port: '+ port);
  })
}

app.on('close', function() {
  console.log('rs');
})

module.exports = app;
