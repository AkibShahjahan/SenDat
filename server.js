var express = require('express');
var app = express();

var mongoose = require('mongoose');
mongoose.connect("mongodb://<pushakib>:<pushakib>@ds029197.mlab.com:29197/sendat")

var http = require('http');
var dispatcher = require('httpdispatcher');
var fs = require('fs');
// var express = require('express');
// var app = express();

dispatcher.setStatic('resources');

app.get('/',function(req, res) {
  res.send("<h1>Welcome to Sendat</h1>");
//Lets define a port we want to listen to
const PORT=8080; 

//We need a function which handles requests and send response
function handleRequest(request, response){
      try {
        //log the request on console
        console.log(request.url);
        //Disptach
        dispatcher.dispatch(request, response);
    } catch(err) {
        console.log(err);
    }
}

//ROUTES
dispatcher.onGet("/home", function(req,res){
    fs.readFile('./index.html', function(err, html){
        if (err){
            throw err;
        }
        res.writeHead(200, {'Content-Type' : 'text/html'});
        res.end(html, 'utf-8');
    });
});

app.listen(3000);
//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(PORT, function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
});
