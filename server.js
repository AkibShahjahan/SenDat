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

var contentRoutes = require('./routes/contents');
app.use('/contents', contentRoutes);
var courseRoutes = require('./routes/courses');
app.use('/courses', courseRoutes);



var cookieparser = require('cookie-parser')();
var bodyparser = require('body-parser').urlencoded({ extended: true });
var expresssession = require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true });
app.use(passport.initialize());
app.use(passport.session()); 
require('./config/passport')(passport); // pass passport for configuration





app.get('/profile', isLoggedIn, function(req, res){
  	console.log(req.user)
    res.render('profile.html');
});

app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));



app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect : '/',
        failureRedirect : '/login'
    }));

// route for logging out
app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

var User = require("./models/user");

app.get("/users", function(req, res) {
	User.find({}, function(err, val) {
		res.send(val);
	})
})


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
    // route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()){
        return next();
    }
    // if they aren't redirect them to the home page
    res.redirect('/login');
}

app.get('/' , function(req , res){
  // Going to index.html in public directory
});

//Lets start our server
app.listen(PORT, function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
});
