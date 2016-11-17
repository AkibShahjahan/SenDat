var http = require('http');
var dispatcher = require('httpdispatcher');
var fs = require('fs');
// var express = require('express');
// var app = express();

dispatcher.setStatic('resources');

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

//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(PORT, function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
});
