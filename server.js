// Get all the packages needed
var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var fs = require('fs');
var path = require('path');
var passport = require('passport');

// BodyParser extracts the body portion of your request and makes its
// accessible through req.body. so that it is easier to get the object.
app.use(bodyParser.json());
app.use(express.static('public'));
//Allows you to access URL Encoded body stuff
app.use(bodyParser.urlencoded());

// Set up Mongoose
var mongoose = require('mongoose');
mongoose.connect("mongodb://pushakib:pushakib@ds029197.mlab.com:29197/sendat");
mongoose.connection.once("open", function() {
    console.log('Mongoose Connected!');
})

// No idea what this is for...
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;

var PORT = 3000

app.use(passport.initialize());
app.use(passport.session());

// var baseRoutes = require('./routes/base');
// app.use('/', baseRoutes);
var contentRoutes = require('./routes/contents');
app.use('/contents', contentRoutes);
var courseRoutes = require('./routes/courses');
app.use('/courses', courseRoutes);




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

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

app.get('/login' , function(req , res){
  // Going to index.html in public directory
   fs.readFile('./views/login.html', function(err, html){
        if (err){
            throw err;
        }
        res.writeHead(200, {'Content-Type' : 'text/html'});
        res.end(html);
    });
});

app.get('/login/facebook',
  passport.authenticate('facebook'));

app.get('/login/facebook/return', passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');

 });

// app.get('/profile', require('connect-ensure-login').ensureLoggedIn(),
//   function(req, res){
//   	console.log("user profile still here")
//     //res.render('profile', { user: req.user });
//   });

app.get('/' , function(req , res){
  // Going to index.html in public directory
});

//Lets start our server
app.listen(PORT, function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
});
