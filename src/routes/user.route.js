import express from"express";
import bcrypt from"bcrypt";
import UserService from"../services/user.service.js";
import BankAccountService from"../services/bank-account.service.js";
import tokenHelper from"../helpers/token.helper.js";
const userRouter = express.Router();

//Get users
userRouter
    .route("/info")
    // Get all Users
    .get(async (req, res) => {
        const users = await UserService.getAllUsers();

        res.json(users);
    })
//Register users
userRouter
    .route("/signup")
    // Create new user
    .post(async (req, res, next) => {
        const userData = req.body;
        try {
            if (userData) {
                // generate salt to hash password
                const salt = await bcrypt.genSalt(10);
                userData.password = await bcrypt.hash(userData.password, salt);
                const newUser = await UserService.addUser(userData);
                let IBANNumberColones = "CR6101001" + Math.floor(Math.pow(10, 13 - 1) + Math.random() * 9 * Math.pow(10, 13 - 1));
                let colonesAccount = {
                    accountNumber: IBANNumberColones,
                    user: userData.email
                };
                await BankAccountService.addBankAccount(colonesAccount);
                let IBANNumberDolares = "CR6101002" + Math.floor(Math.pow(10, 13 - 1) + Math.random() * 9 * Math.pow(10, 13 - 1));
                let dolaresAccount = {
                    accountNumber: IBANNumberDolares,
                    user: userData.email,
                    currency: "Dolar"
                };
                await BankAccountService.addBankAccount(dolaresAccount);
                res.send(newUser);
            }
        } catch (err) {
            next(err);
        }
    });
//Email requests like find and update
userRouter
    .route("/:email")
    // Get single user
    .get(async (req, res) => {
        const userEmail = req.params.email;
        const user = await UserService.getUserByEmail(userEmail);
        !user ? res.sendStatus(404) : res.json(user);
    })
    // Update user by giving id
    .put(async (req, res, next) => {
        const userEmail = req.params.email;
        const userData = req.body;

        try {
            // find and update a user, if no user is found, null will be returned
            const updatedUser = await UserService.updateUser(userEmail, userData);

            !updatedUser ? res.sendStatus(404) : res.json(updatedUser);
        } catch (err) {
            next(err);
        }
    })
    // Delete user by giving id
    .delete(async (req, res) => {
        const userEmail = req.params.email;
        // find and delete a user, if no user is found, null will be returned
        const deleteduser = await UserService.deleteUser(userEmail);

        !deleteduser ? res.sendStatus(404) : res.json(deleteduser);
    });

//Login user
userRouter
    .route("/login")
    // Get single user
    .post(async (req, res) => {
        const userName = req.body.username;
        const password = req.body.password;
        if (userName && password) {
            const user = await UserService.getUserByUsername(userName);

            if (user) {
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


    export default userRouter;
