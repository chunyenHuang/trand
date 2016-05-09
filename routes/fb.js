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

var passport = require('passport');
var Strategy = require('passport-facebook').Strategy;
var expressSession = require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true })
var morgan = require('morgan')('combined');
var loggedIn = require('connect-ensure-login').ensureLoggedIn();

passport.use(new Strategy(
  {
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: process.env.url + '/fb/login/facebook/return',
    profileFields: ['id', 'displayName', 'email', 'gender', 'picture', 'locale', 'age_range', 'profileUrl', 'birthday', 'location', 'about'],
    enableProof: true,
  },
  function(accessToken, refreshToken, profile, cb) {
    return cb(null, profile);
  })
);

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

function sessionToken(length){
  var token = "";
  var possible = "abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for(var x=0; x < length; x++){
    token += possible.charAt(Math.floor(Math.random() * possible.length)+1);
  }
  return token;
}

router.use(morgan);
router.use(expressSession);
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(cookieParser());
router.use(passport.initialize());
router.use(passport.session());

router.get('/login', passport.authenticate('facebook',
  { scope: ['email', 'user_birthday', 'user_location', 'user_about_me']}
));

router.get('/login/facebook/return', passport.authenticate('facebook',
  { failureRedirect: '/login',
    authType: 'rerequest', scope: ['email'],
  }),
  function(req, res) {
    var email = req.user.emails[0].value;
    var name = req.user.displayName;
    name = name.split(' ');
    var firstName = name[0];
    var lastName = name[1];
    var token = sessionToken(50);
    var pw = sessionToken(10);
    var imgUrl = req.user.photos[0].value;

    dbClient.connect(dbUrl, function (err, db) {
      if (!err) {
        var users = db.collection('users');
        users.find({email: email}).toArray(function (err, results) {
          if (results.length>0) {
            users.update({email:email},
              {$set: {
                token: token,
                loginCount: results[0].loginCount + 1
              }
            });
            res.cookie('trand2016', token);
            res.redirect(process.env.url);
            db.close();
          } else {
            users.insert({
              email:email,
              firstName: firstName,
              lastName: lastName,
              password: pw,
              token: token,
              loginCount: 1,
              img: imgUrl,
              registerDate: new Date(),
            }, function (err ,results) {
              res.cookie('trand2016', token);
              res.redirect(process.env.url);
              db.close();
            })
          }
        })
      } else {
        res.sendStatus(404);
        db.close();
      }
    })
  }
);

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

module.exports = router;
