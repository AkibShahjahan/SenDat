var express = require('express');
var app = express();
var mongoose = require('mongoose');
mongoose.connect("mongodb://<pushakib>:<pushakib>@ds029197.mlab.com:29197/sendat")
app.get('/',function(req, res) {
  res.send("<h1>Welcome to Sendat</h1>");
});

app.listen(3000);
