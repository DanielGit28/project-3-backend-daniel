const User = require("../models/user.model");

class UserService {

  static async getAllUsers() {
    const users = await User.find();

    return users;
  }

  static async getUserById(id) {
    const user = await User.findById(id);

    return user;
  }

  static async getUserByEmail(email) {
    const user = await User.findOne({email: email});

    return user;
  }

  static async addUser(userData) {
    const user = new User(userData);

    await user.save();

    return user;
  }

  static async updateUser(email, newData) {
    const updatedUser = await User.findOneAndUpdate({email: email}, newData, {
      returnDocument: "after",
      runValidators: true,
    });

    return updatedUser;
  }

  static async deleteUser(email) {
    const user = await User.findOneAndDelete({email: email});

    return user;
  }
}

module.exports = UserService;
