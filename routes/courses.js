var express = require("express");
var router = express.Router()
var fs = require('fs');

var Content = require("../models/content");


router.get('/:courseid' , function(req , res){
  console.log("im here");
    fs.readFile('./views/note.html', function(err, html){
        if (err){
            throw err;
        }
        res.writeHead(200, {'Content-Type' : 'text/html'});
        res.end(html)
    });
});


module.exports = router;
