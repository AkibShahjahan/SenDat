var express = require('express');
var router = express.Router();

var users = require('./users.js');
var notes = require('./notes.js');
var usernotes = require('./usernotes.js');

router.get('/users', users.getAll);
router.get('/user/:id', users.getOne);
router.get('user/fb/:id', users.getOneByFb)

router.get('/notes', notes.getAll);
router.get('/note/:id', notes.getOne);
router.get('/notes/course/:coursecode', notes.getByCourse)
router.post('/note', notes.create);
router.get('/notes/find/search', notes.search);
router.delete('/notes/deleteall', notes.deleteAll); // TODO: Dangerous. Delete this later.

router.get('/usernotes', usernotes.getAll);
router.get('/usernotes/:userFbId', usernotes.getUserNotes);



module.exports = router;
