var express = require("express");
var router = express.Router()
var Content = require("../models/content");

router.post('/' , function(req , res){
    var writing = req.body.writing;
    var title = req.body.title;
    var courseCode = req.body.course_code;
    if(courseCode) {
        courseCode.toUpperCase();
    }
    var newContent = {
        writing: writing,
        title: title,
        courseCode: courseCode
    }
    Content.create(newContent, function(err, con) {
      console.log(con);
        if(con) {
          res.send("http://localhost:3000/"+con._id);
        } else {
          res.send("");
        }
    });
})

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

router.get('/courses/:courseCode', function(req, res) {
  var courseCode = req.params.courseCode;
  if(courseCode) {
    courseCode.toUpperCase();
  }
  Content.find({"courseCode": courseCode}, function(err, contents) {
    if(contents) {
      res.send(contents);
    } else {
      res.send([]);
    }
  })
})



module.exports = router;
