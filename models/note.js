var mongoose = require("mongoose");

var noteSchema = new mongoose.Schema({
    writing: String,
    title : String,
    coursecode: String,
    delta: Object,
    ownerFbId: String,
    date : {
      type : Date
    },
    privacyLevel: String
});

var Note = mongoose.model("Note", noteSchema);

module.exports = Note;
