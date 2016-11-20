var express = require("express");
var router = express.Router()
var fs = require('fs');

router.get('' , function(req , res){
  // Going to index.html in public directory
})
router.get('/:id' , function(req , res){
    fs.readFile('./views/main.html', function(err, html){
        if (err){
            throw err;
        }
        res.writeHead(200, {'Content-Type' : 'text/html'});
        res.end(html)
    });
});

module.exports = router;
