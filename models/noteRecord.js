var mongoose = require("mongoose");

var noteRecordSchema = new mongoose.Schema({
  noteId: String,
  views: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ]
});

var NoteRecord = mongoose.model("NoteRecord", noteRecordSchema);

module.exports = NoteRecord;
