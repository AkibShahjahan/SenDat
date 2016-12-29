var UserNotes = require("../models/usernotes");

var users = {
  getAll: function(req, res) {
    UserNotes.find({}, function(err, usernotes) {
      if(usernotes) {
        res.send(usernotes);
      } else {
        res.send({error: "Something went wrong"});
      }
    })
  },
  getUserNotes: function(req, res) {
    var userFbId = req.params.userFbId;
    UserNotes.findOne({"userFbId": userFbId}).populate("notes").exec(function(err, usernotes){
      if(usernotes){
        res.json(usernotes);
      } else  {
        res.json({error: "No user notes found"});
      }
    });
  }
};

module.exports = users;
