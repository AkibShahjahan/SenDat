var mongoose = require("mongoose");

//public
//personal
//private
var contentSchema = new mongoose.Schema({
    writing: String,
    title : String,
    coursecode: String,
    delta: Object,
    ownerFbId: String,
    date : {
      type : Date
      //default: Date.now
    },
    privacyLevel: String
});

var Content = mongoose.model("Content", contentSchema);

module.exports = Content;
