const express = require("express");
const AuthorService = require("../services/author.service");
const authorsRouter = express.Router();
const {
  formatRequestError,
  isValidationError,
} = require("../helpers/errors.helper");

authorsRouter
  .route("/")
  // Get all authors
  .get(async (req, res) => {
    const authors = await AuthorService.getAllAuthors();

    res.json(authors);
  })
  // Create new author
  .post(async ( req, res, next) => {
    const authorData = req.body;
    try {
      const newAuthor = await AuthorService.addAuthor(authorData);

      res.json(newAuthor);
    } catch (err) {
      next(err);
    }
  });

authorsRouter
  .route("/:id")
  // Get single author
  .get(async (req, res) => {
    let authorID = req.params.id;
    console.log(authorID, authorID.length);
    if (authorID && authorID.length === 24) {
      let author = await AuthorService.getAuthorById(authorID);
    !author ? res.sendStatus(404) : res.json(author);
    } else {
      res.json("Id is not valid")
    }
    
  })
  // Update author by giving id
  .put(async (req, res, next) => {
    const authorID = req.params.id;
    const authorData = req.body;

    try {
      // find and update a author, if no author is found, null will be returned
      const updatedAuthor = await AuthorService.updateAuthor(authorID, authorData);

      !updatedAuthor ? res.sendStatus(404) : res.json(updatedAuthor);
    } catch (err) {
      next(err);
    }
  })
  // Delete author by giving id
  .delete(async (req, res) => {
    const authorID = req.params.id;
    // find and delete a author, if no author is found, null will be returned
    const deletedAuthor = await AuthorService.deleteAuthor(authorID);

    !deletedAuthor ? res.sendStatus(404) : res.json(deletedAuthor);
  });

module.exports = authorsRouter;