const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true},
  username: { type: String, required: true, unique: true},
  password: { type: String, minLength: 4}
});

const User = mongoose.model("User", userSchema);

module.exports = User;