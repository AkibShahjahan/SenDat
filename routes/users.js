var User = require("../models/user");

var users = {
  getAll: function(req, res) {
    User.find({}, function(err, users) {
      if(users) {
        res.send(users);
      } else {
        res.send({error: "Something went wrong"});
      }
  	});
  },
  getOne: function(req, res) {
    var id = req.params.id;
    User.findById(id, function(err, user) {
      if(user) {
        res.send(user);
      } else {
        res.send({error: "Something went wrong"});
      }
    })
  },
  getOneByFb: function(req, res) {
    var fbId = req.params.fbId
    User.find("facebook.id", function(err, user) {
      if(user) {
        res.send(user);
      } else {
        res.send({error: "Something went wrong"});
      }
    });
  }
};

module.exports = users;
