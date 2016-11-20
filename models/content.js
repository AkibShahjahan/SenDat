var mongoose = require("mongoose");

var contentSchema = new mongoose.Schema({
    writing: String,
    title : String,
    courseCode: String
});

var Content = mongoose.model("Content", contentSchema);

module.exports = Content;
