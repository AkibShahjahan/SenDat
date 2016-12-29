var Note = require("../models/note.js");
var User = require("../models/user.js")
var UserNotes = require("../models/usernotes.js");
var Search = require("../helpers/search.js");

var notes = {
  getAll: function(req, res) {
    Note.find({}, function(err, notes) {
      if(notes) {
  		    res.send(notes);
      } else {
        res.send({error: "Something went wrong"});
      }
  	});
  },
  getOne: function(req, res) {
    var id = req.params.id;
    Note.findById(id, function(err, note) {
      if(note) {
        res.send(note);
      } else {
        res.send({error: "Something went wrong"});
      }
    })
  },
  getByCourse: function(req, res) {
    var coursecode = req.params.coursecode;
    if(coursecode) {
      coursecode = coursecode.toUpperCase();
    }
    Note.find({"coursecode": coursecode}, function(err, notes) {
      if(notes) {
        res.send(notes);
      } else {
        res.send([]);
      }
    })
  },
  create: function(req, res) {
    var writing = req.body.writing;
    var title = req.body.title;
    var coursecode = req.body.coursecode;
    var delta = req.body.delta;
    var privacyLevel = req.body.privacyLevel;
    if(coursecode) {
        coursecode = coursecode.toUpperCase();
        coursecode = coursecode.replace(/\s+/g, '');
    }
    var date= new Date();
		var currentTime = date.toUTCString();
    var newNote = {
        writing: writing,
        title: title,
        coursecode: coursecode,
        delta: delta,
        ownerFbId: req.user.facebook.id,
        date: currentTime,
        privacyLevel: privacyLevel
    }
    Note.create(newNote, function(err, con) {
      if(con) {
        res.send("http://localhost:3000/courses/"+con.coursecode+"/"+con._id);
        UserNotes.findOne({"userFbId" : req.user.facebook.id}, function(err, usernotes){
          if(usernotes) {
            usernotes.notes.push(con._id);
            usernotes.save();
          }
        });
      } else {
        res.send({error: "Something went wrong"});
      }
    });
  },
  deleteAll: function(req, res) {
    Note.remove({} , function(err , res){
        if(err){
            throw err;
        } else {
            res.send('success');
        }
    });
  },
  search: function(req, res) {
    Note.find({"coursecode": new RegExp(req.query.q, "i")}, function(err, notes) {
      var newArr = [];
      var index = 0;
      if(notes) {
        var len = notes.length;
        for(var i = 0; i<len; i++) {
          if(Search.uniqueCourseCode(newArr, notes[i])) {
            newArr[index++] = {
              id: notes[i]._id,
              title: notes[i].coursecode,
              type: "coursecode"
            }
          }
        }
      }
      Note.find({"title": new RegExp(req.query.q, "i")}, function(err, moreNotes) {
        if(moreNotes) {
          var len = moreNotes.length;
          for(var i = 0; i<len; i++) {
            newArr[index++] = {
              id: moreNotes[i]._id,
              title: moreNotes[i].title,
              coursecode: moreNotes[i].coursecode,
              type: "title"
            }
          }
        }
        console.log(newArr);
        res.send({"results": newArr});
      })
    })
  }
};

module.exports = notes;
