var mongoose = require("mongoose");

var UserNotesSchema = new mongoose.Schema({
    userFbId : String,
    notes : [{
    	type : mongoose.Schema.Types.ObjectId,
    	ref : 'Note'
    }]

});

var UserNotes = mongoose.model("UserNotes", UserNotesSchema);

module.exports = UserNotes;
