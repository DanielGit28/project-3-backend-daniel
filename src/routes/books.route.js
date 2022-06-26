const express = require("express");
const BookService = require("../services/book.service");
const booksRouter = express.Router();
const {
  formatRequestError,
  isValidationError,
} = require("../helpers/errors.helper");

booksRouter
  .route("/")
  // Get all books
  .get(async (req, res) => {
    const books = await BookService.getAllBooks();

    res.json(books);
  })
  // Create new book
  .post(async (req, res, next) => {
    const bookData = req.body;

    try {
      const newbook = await BookService.addBook(bookData);

      res.send(newbook);
    } catch (err) {
      next(err);
    }
  });

booksRouter
  .route("/:id")
  // Get single book
  .get(async (req, res) => {
    const bookID = req.params.id;
    if (bookID && bookID.length === 24) {
      const book = await BookService.getBookById(bookID);

    !book ? res.sendStatus(404) : res.json(book);
    } else {
      res.json("Id is not valid")
    }
  })
  // Update book by giving id
  .put(async (req, res, next) => {
    const bookID = req.params.id;
    const bookData = req.body;

    try {
      // find and update a book, if no book is found, null will be returned
      const updatedbook = await BookService.updateBook(bookID, bookData);

      !updatedbook ? res.sendStatus(404) : res.json(updatedbook);
    } catch (err) {
      next(err);
    }
  })
  // Delete book by giving id
  .delete(async (req, res) => {
    const bookID = req.params.id;
    // find and delete a book, if no book is found, null will be returned
    const deletedbook = await BookService.deleteBook(bookID);

    !deletedbook ? res.sendStatus(404) : res.json(deletedbook);
  });

module.exports = booksRouter;
