var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var fs = require('fs');
var path = require('path');

//bodyParser extracts the body portion of your request and makes its
// accessible through req.body. so that it is easier to get the object.
app.use(bodyParser.json());


app.use(express.static('public'));


//Allows you to access URL Encoded body stuff
app.use(bodyParser.urlencoded());


var mongoose = require('mongoose');
mongoose.connect("mongodb://pushakib:pushakib@ds029197.mlab.com:29197/sendat");

mongoose.connection.once("open", function() {
    console.log("Workin...");
})
var contentSchema = new mongoose.Schema({
    writing: String,
    title : String
});

var Content = mongoose.model("Content", contentSchema);

var mongodb = require('mongodb');

var MongoClient = mongodb.MongoClient;


//Lets define a port we want to listen to
var PORT = 3000

app.get('/' , function(req , res){
  console.log("Going to index.html...");
})

app.post('/content' , function(req , res){
    var writing = req.body.writing;
    var title = req.body.title;
    var newContent = {
        writing: writing,
        title: title
    }
    Content.create(newContent, function(err, con) {
        console.log(con);
    });
})



app.get('/content/:id' , function(req , res){
    Content.findById(req.params.id, function(err, content) {
        if(content) {
            res.json(content);
        } else {
            res.json({error: "No content found"});
        }
    })
});

// app.put('/content', function(req, res) {
//     var content_id = req.body.content_id;
//     var writing = req.body.writing;
//     var title = req.body.title;
//     Content.findBy
// })


//Lets start our server
app.listen(PORT, function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
});
