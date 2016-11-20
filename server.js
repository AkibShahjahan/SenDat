// Get all the packages needed
var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var fs = require('fs');
var path = require('path');

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

var baseRoutes = require('./routes/base');
app.use('/', baseRoutes);
var contentRoutes = require('./routes/contents');
app.use('/contents', contentRoutes);
var courseRoutes = require('./routes/courses');
app.use('/courses', courseRoutes);

//Lets start our server
app.listen(PORT, function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
});
