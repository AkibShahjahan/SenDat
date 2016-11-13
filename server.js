var express = require('express');
var app = express();


app.get('/',function(req, res) {
  res.send("<h1>Welcome to Sendat</h1>");
});

app.listen(3000);
