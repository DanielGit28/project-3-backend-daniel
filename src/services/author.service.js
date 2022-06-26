const Author = require("../models/author.model");

class AuthorService {

  static async getAllAuthors() {
    const authors = await Author.find();

    return authors;
  }

  static async getAuthorById(id) {
    const author = await Author.findById(id);

    return author;
  }

  static async addAuthor(authorData) {
    const author = new Author(authorData);

    await author.save();

    return author;
  }

  static async updateAuthor(id, newData) {
    const updatedAuthor = await Author.findByIdAndUpdate(id, newData, {
      returnDocument: "after",
      runValidators: true,
    });

    return updatedAuthor;
  }

  static async deleteAuthor(id) {
    const author = await Author.findByIdAndDelete(id);

    return author;
  }
}

module.exports = AuthorService;
