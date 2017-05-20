var UserNotes = require("./usernotes.js")
var NoteRecord = require("./noteRecord.js")
var mongoose = require("mongoose");

var noteSchema = new mongoose.Schema({
    author: String,
    writing: String,
    title : String,
    coursecode: String,
    delta: Object,
    ownerFbId: String,
    date : {
      type : Date
    },
    privacyLevel: String,
    rankScore: Number
});

noteSchema.post('remove', function(next) {
  UserNotes.update({ notes : {$in: [this._id]} }, {$pullAll: {notes: [this._id]}}).exec();
  NoteRecord.remove({ nodeId: this._id }).exec();
  next;
});

var Note = mongoose.model("Note", noteSchema);

module.exports = Note;
