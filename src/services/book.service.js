const Book = require("../models/book.model");

class BookService {

  static async getAllBooks() {
    const books = await Book.find();

    return books;
  }

  static async getBookById(id) {
    const book = await Book.findById(id);

    return book;
  }

  static async addBook(bookData) {
    const book = new Book(bookData);

    await book.save();

    return book;
  }

  static async updateBook(id, newData) {
    const updatedBook = await Book.findByIdAndUpdate(id, newData, {
      returnDocument: "after",
      runValidators: true,
    });

    return updatedBook;
  }

  static async deleteBook(id) {
    const book = await Book.findByIdAndDelete(id);

    return book;
  }
}

module.exports = BookService;
