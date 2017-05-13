// REQUIRES
var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var fs = require('fs');
var path = require('path');
var passport = require('passport');

// OWN REQUIRES
var Auth = require('./helpers/auth');

// USE
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use('/public', express.static(path.join(__dirname, 'public')))

app.all('/*', function(req, res, next) {
  // CORS headers
  res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  // Set custom headers for CORS
  res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
  if (req.method == 'OPTIONS') {
    res.status(200).end();
  } else {
    next();
  }
});

// MONGOOSE SETUP
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://pushakib:pushakib@ds029197.mlab.com:29197/sendat");
mongoose.connection.once("open", function() {
    console.log('Mongoose Connected!');
})

// PASSPORT SETUP
var cookieparser = require('cookie-parser')();
var bodyparser = require('body-parser').urlencoded({ extended: true });
var expresssession = require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true });
app.use(expresssession); // has to be above passport.intialize() and passport.session()
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport); // pass passport for configuration

// Authentication Required
// app.all('/api/*', Auth.isAuthenticated); // TODO: UNCOMMENT

// ROUTING
app.use('/api', require('./routes'));
app.use('/courses', require('./routes/courses'));

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
app.get('/login', Auth.isNotLoggedIn,  function(req , res){
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

// SERVER SETUP
var PORT = 3000
app.listen(PORT, function(){
    console.log("Server listening on: http://localhost:%s", PORT);
});
