var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
    fbid: String,
    token: String
});

var User = mongoose.model("User", userSchema);

module.exports = User;
