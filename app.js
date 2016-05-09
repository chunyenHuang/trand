// Express
var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
// Database
var mongodb = require('mongodb');
var dbClient = mongodb.MongoClient;
var ObjectId = mongodb.ObjectId;
var dbUrl = process.env.MONGODB_URI || 'mongodb://localhost/trand'

// Routes
var checkCurrentUser = require('./routes/checkCurrentUser.js');
var api = require('./routes/api');
var userRoute = require('./routes/user');
var collections = require('./routes/collections');
var combinations = require('./routes/combinations');
var ideas = require('./routes/ideas');
var aws = require('./routes/aws');
var fb = require('./routes/fb');

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
app.use(checkCurrentUser);
app.use('/fb', fb);
app.use('/api', api);
app.use('/user', userRoute);
app.use('/collections', collections);
app.use('/combinations', combinations);
app.use('/ideas', ideas);
app.use('/aws', aws);

app.use(express.static('./public/'));

if (!require.main.loaded) {
  app.listen(port, function () {
    console.log('running on port: '+ port);
  })
}

app.on('close', function() {
  console.log('rs');
})

module.exports = app;
