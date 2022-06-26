const mongoose = require("mongoose");

//Date format: MM/DD/YYYY FOR MONGO PC
const authorSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  birthday: { type: Date, required: true },
});

const Author = mongoose.model("Author", authorSchema);

module.exports = Author;