
const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true},
  author: String,
  published_at: { type: Date, required: true },
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;