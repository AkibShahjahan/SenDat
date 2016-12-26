var express = require("express");
var router = express.Router()
var Content = require("../models/content");
var User = require("../models/user");
var UserNotes = require("../models/usernotes");
var Auth = require("../helpers/auth")

router.post('/', Auth.isAuthenticated, function(req , res){
    var writing = req.body.writing;
    var title = req.body.title;
    var coursecode = req.body.coursecode;
    var delta = req.body.delta;
    var privacyLevel = req.body.privacy_level;
    if(coursecode) {
        coursecode = coursecode.toUpperCase();
        coursecode = coursecode.replace(/\s+/g, '');
    }
    var date= new Date();
		var currentTime = date.toUTCString();
    var newContent = {
        writing: writing,
        title: title,
        coursecode: coursecode,
        delta: delta,
        ownerFbId: req.user.facebook.id,
        date: currentTime,
        privacyLevel: privacyLevel
    }

    Content.create(newContent, function(err, con) {
      if(con) {
        res.send("http://localhost:3000/courses/"+con.coursecode+"/"+con._id);
        UserNotes.findOne({"userFbId" : req.user.facebook.id}, function(err, usernotes){
          if(usernotes) {
            usernotes.notes.push(con._id);
            usernotes.save();
          }
        });
      } else {
        res.send("");
      }
    });
})

// TODO: Secure it completely
router.get("/users", function(req, res) {
	User.find({}, function(err, val) {
		res.send(val);
	})
})

// TODO: Secure it completely
router.get("/usernotes", function(req, res) {
  UserNotes.find({}, function(err, val) {
    res.send(val);
  })
})

router.get("/usernotes/:userId", function(req, res) {
  var userId = req.params.userId;
  UserNotes.findOne({"userId": userId}).populate("notes").exec(function(err, usernotes){
    if(usernotes){
      res.json(usernotes);
    } else  {
      res.json({error: "No user notes found"});
    }
  });
});


router.delete('/deleteall' , function(req , res){
    Content.remove({} , function(err , res){
        if(err){
            throw err;
        } else {
            res.end('success');
        }
    });
});

router.get('/all' , function(req , res){
    Content.find({}, function(req, contents) {
        if(contents) {
            res.json(contents);
        } else {
            res.json({error: "No content found"});
        }
    });
});

router.get('/:id' , function(req , res){
    Content.findById(req.params.id, function(err, content) {
        if(content) {
            res.json(content);
        } else {
            res.json({error: "No content found"});
        }
    })
});

router.get('/courses/:coursecode', function(req, res) {
  var coursecode = req.params.coursecode;
  if(coursecode) {
    coursecode = coursecode.toUpperCase();
  }
  Content.find({"coursecode": coursecode}, function(err, contents) {
    if(contents) {
      res.send(contents);
    } else {
      res.send([]);
    }
  })
})

router.get('/find/search', function(req, res) {
  Content.find({"coursecode": new RegExp(req.query.q, "i")}, function(err, contents) {
    var newArr = [];
    var index = 0;
    if(contents) {
      var len = contents.length;
      for(var i = 0; i<len; i++) {
        if(uniqueCourseCode(newArr, contents[i])) {
          newArr[index++] = {
            id: contents[i]._id,
            title: contents[i].coursecode,
            type: "coursecode"
          }
        }
      }
    }
    Content.find({"title": new RegExp(req.query.q, "i")}, function(err, moreContents) {
      if(moreContents) {
        var len = moreContents.length;
        for(var i = 0; i<len; i++) {
          newArr[index++] = {
            id: moreContents[i]._id,
            title: moreContents[i].title,
            coursecode: moreContents[i].coursecode,
            type: "title"
          }
        }
      }
      console.log(newArr);
      res.send({"results": newArr});
    })
  })
})

function uniqueCourseCode(arr, obj) {
  var len = arr.length;
  for(var i = 0; i < len; i++) {
    if (arr[i].title === obj.coursecode) {
        return false;
    }
  }
  return true;
}

module.exports = router;
