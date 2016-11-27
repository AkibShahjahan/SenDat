var mongoose = require("mongoose");

var contentSchema = new mongoose.Schema({
    writing: String,
    title : String,
    coursecode: String,
    delta: Object
});

var Content = mongoose.model("Content", contentSchema);

module.exports = Content;
