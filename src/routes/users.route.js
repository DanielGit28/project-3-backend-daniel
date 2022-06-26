const express = require("express");
const bcrypt = require('bcrypt');
const UserService = require("../services/user.service");
const tokenHelper = require("../helpers/token.helper");
const userRouter = express.Router();
const {
    formatRequestError,
    isValidationError,
} = require("../helpers/errors.helper");

userRouter
    .route("/signup")
    // Get all Users
    .get(async (req, res) => {
        const users = await UserService.getAllUsers();

        res.json(users);
    })
    // Create new user
    .post(async (req, res, next) => {
        const userData = req.body;
        if (!(userData.username && userData.password)) {
            return res.status(400).send({ error: "Data not formatted properly" });
        }

        try {
            // generate salt to hash password
            const salt = await bcrypt.genSalt(10);
            userData.password = await bcrypt.hash(userData.password, salt);

            const newUser = await UserService.addUser(userData);
            

            res.send(newUser);
        } catch (err) {
            next(err);
        }
    });

userRouter
    .route("/login")
    // Get single user
    .post(async (req, res) => {
        const userName = req.body.username;
        const password = req.body.password;
        if (userName && password) {
            const user = await UserService.getUserByUsername(userName);

            if(user) {
                const validPassword = await bcrypt.compare(password, user.password);
            if (validPassword) {
                const token = tokenHelper.accessTokenGenerator({ username: userName });
                res.json(token);
            } else {
                res.json({ error: "Invalid Password" });
            }
            } else {
                res.json({ error: "User not found" });
            }
        } else {
            res.json({ error: "Login not valid" });
        }
    });
userRouter
    .route("/:id")
    // Get single user
    .get(async (req, res) => {
        const userID = req.params.id;
        if (userID && userID.length === 24) {
            const user = await UserService.getUserById(userID);

            !user ? res.sendStatus(404) : res.json(user);
        } else {
            res.json("Id is not valid")
        }
    })
    // Update user by giving id
    .put(async (req, res, next) => {
        const userID = req.params.id;
        const userData = req.body;

        try {
            // find and update a user, if no user is found, null will be returned
            const updatedUser = await UserService.updateUser(userID, userData);

            !updatedUser ? res.sendStatus(404) : res.json(updatedUser);
        } catch (err) {
            next(err);
        }
    })
    // Delete user by giving id
    .delete(async (req, res) => {
        const userID = req.params.id;
        // find and delete a user, if no user is found, null will be returned
        const deleteduser = await UserService.deleteUser(userID);

        !deleteduser ? res.sendStatus(404) : res.json(deleteduser);
    });

module.exports = userRouter;
