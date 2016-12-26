// REQUIRES
var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var fs = require('fs');
var path = require('path');
var passport = require('passport');

// OWN REQUIRES
var contentRoutes = require('./routes/contents');
var courseRoutes = require('./routes/courses');
var Auth = require('./helpers/auth');

// USE
// BodyParser extracts the body portion of your request and makes its
// accessible through req.body. so that it is easier to get the object.
app.use(bodyParser.json());
//Allows you to access URL Encoded body stuff
app.use(bodyParser.urlencoded());
app.use('/public', express.static(path.join(__dirname, 'public')))
//app.use(express.static('public'));


// MONGOOSE SETUP
var mongoose = require('mongoose');
mongoose.connect("mongodb://pushakib:pushakib@ds029197.mlab.com:29197/sendat");
mongoose.connection.once("open", function() {
    console.log('Mongoose Connected!');
})

// No idea what this is for...
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;

var PORT = 3000

// PASSPORT SETUP
var cookieparser = require('cookie-parser')();
var bodyparser = require('body-parser').urlencoded({ extended: true });
var expresssession = require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true });
app.use(expresssession); // has to be above passport.intialize() and passport.session()
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport); // pass passport for configuration


// ROUTING
// Routes have to be below passport.session()
app.use('/contents', contentRoutes);
app.use('/courses', courseRoutes);
// TODO: later change it to /api/users, /api/courses, /api/contents



// BASE ROUTES
app.get('/' , Auth.isLoggedIn, function(req , res){
  // Going to index.html in public directory
  console.log(req.user);
  fs.readFile('./views/index.html', function(err, html){
       if (err){
           throw err;
       }
       res.writeHead(200, {'Content-Type' : 'text/html'});
       res.end(html);
  });
});

app.get('/profile', Auth.isLoggedIn, function(req, res){
  	console.log(req.user)
    fs.readFile('./views/profile.html', function(err, html){
         if (err){
             throw err;
         }
         res.writeHead(200, {'Content-Type' : 'text/html'});
         res.end(html);
    });
});
app.get('/login' ,Auth.isNotLoggedIn,  function(req , res){
  // Going to index.html in public directory
   fs.readFile('./views/login.html', function(err, html){
        if (err){
            throw err;
        }
        res.writeHead(200, {'Content-Type' : 'text/html'});
        res.end(html);
   });
});
app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

// FACEBOOK ROUTES
app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));
app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect : '/',
        failureRedirect : '/login'
}));

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// SERVER START
app.listen(PORT, function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
});
