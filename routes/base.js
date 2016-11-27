var express = require("express");
var router = express.Router()
var fs = require('fs');
var passport = require('passport');
var Strategy = require('passport-facebook').Strategy;
var morgan = require('morgan')('combined');
var cookieparser = require('cookie-parser')();
var bodyparser = require('body-parser').urlencoded({ extended: true });
var expresssession = require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true });

var FACEBOOK_APP_ID = '194473814346087';
var FACEBOOK_APP_SECRET = 'd4d2ca6c678e1578bd823611c612ee36';

passport.use(new Strategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: 'http://localhost:3000/login/facebook/return'
  },
  function(accessToken, refreshToken, profile, cb) {
    return cb(null, profile);
  }));

// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  In a
// production-quality application, this would typically be as simple as
// supplying the user ID when serializing, and querying the user record by ID
// from the database when deserializing.  However, due to the fact that this
// example does not have a database, the complete Facebook profile is serialized
// and deserialized.
// passport.serializeUser(function(user, cb) {
//   cb(null, user);
// });

// passport.deserializeUser(function(obj, cb) {
//   cb(null, obj);
// });


router.get('/login' , function(req , res){
  // Going to index.html in public directory
   fs.readFile('./views/login.html', function(err, html){
        if (err){
            throw err;
        }
        res.writeHead(200, {'Content-Type' : 'text/html'});
        res.end(html);
    });
});

router.get('/login/facebook',
  passport.authenticate('facebook'));

router.get('/login/facebook/return', passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');

  });

// app.get('/profile', require('connect-ensure-login').ensureLoggedIn(),
//   function(req, res){
//   	console.log("user profile still here")
//     //res.render('profile', { user: req.user });
//   });

router.get('' , function(req , res){
  // Going to index.html in public directory
});

module.exports = router;
