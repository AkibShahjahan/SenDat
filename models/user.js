var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
  facebook: {
    id: String,
    firstName: String,
    lastName: String,
    fullName: String,
    email: String,
    token: String
  }
});

var User = mongoose.model("User", userSchema);

module.exports = User;
