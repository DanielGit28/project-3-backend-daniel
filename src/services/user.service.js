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

  static async getUserByUsername(username) {
    const user = await User.findOne({username: username});

    return user;
  }

  static async addUser(userData) {
    const user = new User(userData);

    await user.save();

    return user;
  }

  static async updateUser(id, newData) {
    const updatedUser = await User.findByIdAndUpdate(id, newData, {
      returnDocument: "after",
      runValidators: true,
    });

    return updatedUser;
  }

  static async deleteUser(id) {
    const user = await User.findByIdAndDelete(id);

    return user;
  }
}

module.exports = UserService;
