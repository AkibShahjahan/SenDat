var express = require('express');
var app = express();


app.get('/',function(req, res) {
  res.send("<h1>Welcome to Sendat</h1>");
});

// This is ma branch

app.listen(3000);
