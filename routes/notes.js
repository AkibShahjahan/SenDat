var Note = require("../models/note.js");
var User = require("../models/user.js")
var UserNotes = require("../models/usernotes.js");
var NoteRecord = require("../models/noteRecord.js");
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
    Note.findById(id, function(err, foundNote) {
      if(foundNote) {
        var noteId = foundNote._id;
        res.send(foundNote);
        NoteRecord.findOne({"noteId": noteId}, function(err, foundNoteRecord) {
          if(foundNoteRecord && foundNoteRecord.views.indexOf(noteId) == -1) {
            foundNoteRecord.views.push(noteId);
            foundNoteRecord.save();
            foundNote.rankScore++;
            foundNote.save();
          }
        })
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
    var searchQuery = {
      "coursecode" : coursecode,
      "privacyLevel" : "PUBLIC"
    }
    Note.find(searchQuery)
        .sort({"rankScore": -1}).exec(function(err, notes) {
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
    var rankScore = 0;
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
        privacyLevel: privacyLevel,
        rankScore: rankScore
    }
    Note.create(newNote, function(err, con) {
      if(con) {
        res.send(con._id);
        UserNotes.findOne({"userFbId" : req.user.facebook.id}, function(err, usernotes){
          console.log(usernotes);
          if(usernotes) {
            usernotes.notes.push(con._id);
            usernotes.save();
          }
        });
        var newNoteRecord = {
          noteId: con._id,
          views: []
        }
        NoteRecord.create(newNoteRecord);
      } else {
        res.send({error: "Something went wrong"});
      }
    });
  },

  updateNote: function(req,res){
    var id = req.params.id;
    var delta = req.body.delta;
    var writing = req.body.writing;
    var privacyLevel = req.body.privacyLevel;
    var coursecode = req.body.coursecode;
    var title = req.body.title;
    console.log(req.body);
    Note.findOneAndUpdate({ _id : id } , { $set : { "delta": delta , "writing": writing, "title" : title , "coursecode" : coursecode,  "privacyLevel" : privacyLevel}}, {new: true}, function(err,doc){
      if(err){
        console.log("Something wrong when updating data!");
       }
      console.log(doc);
      res.send(doc);
    });
  },

  deleteNote: function(req,res){
    var id = req.params.id;
    console.log(id)
    Note.findById(id,function(err,notefound){
      if (notefound){
        notefound.remove();
        res.send("success")
      } else{
        res.send("failure")
      }
    });
    
  },

  deleteAll: function(req, res) {
    // Have to delete one by one for remove middleware to get called
    Note.find({}, function(err, notes){
    if(err) {
      console.log(err);
    } else {
      notes.forEach(function(note){
        note.remove();
      })
      res.send("success");
    }
  })
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
      Note.find({"title": new RegExp(req.query.q, "i")})
          .sort({"rankScore": -1}).exec(function(err, moreNotes) {
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
