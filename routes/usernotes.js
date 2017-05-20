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
    if(req.user.facebook.id !== req.params.userFbId) {
      res.json({error: "Not Authorized"});
      res.status(401);
    }
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
