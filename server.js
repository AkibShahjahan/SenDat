// Notes branch

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
    title : String,
    courseCode: String
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
    var courseCode = req.body.course_code;
    var newContent = {
        writing: writing,
        title: title,
        courseCode: "cs246"
    }
    Content.create(newContent, function(err, con) {
      console.log(con);
        if(con) {
          res.send("http://localhost:3000/"+con._id);
        } else {
          res.send("");
        }
    });
})

app.get('/courses/:courseid' , function(req , res){
    fs.readFile('./note.html', function(err, html){
        if (err){
            throw err;
        }
        res.writeHead(200, {'Content-Type' : 'text/html'});
        res.end(html)
    });
});
app.get('/:id' , function(req , res){
    fs.readFile('./main.html', function(err, html){
        if (err){
            throw err;
        }
        res.writeHead(200, {'Content-Type' : 'text/html'});
        res.end(html)
    });
});

app.delete('/content/deleteall' , function(req , res){
    Content.remove({} , function(err , res){
        if(err){
            throw err;
        } else {
            res.end('success');
        }
    });
});

app.get('/content/all' , function(req , res){
    Content.find({}, function(req, contents) {
        if(contents) {
            res.json(contents);
        } else {
            res.json({error: "No content found"});
        }
    });
});

app.get('/content/:id' , function(req , res){
    Content.findById(req.params.id, function(err, content) {
        if(content) {
            res.json(content);
        } else {
            res.json({error: "No content found"});
        }
    })
});

app.get('/content/courses/:courseCode', function(req, res) {
  var courseCode = req.params.courseCode;
  Content.find({"courseCode": courseCode}, function(err, contents) {
    if(contents) {
      res.send(contents);
    } else {
      res.send([]);
    }
  })
})

//Lets start our server
app.listen(PORT, function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
});
