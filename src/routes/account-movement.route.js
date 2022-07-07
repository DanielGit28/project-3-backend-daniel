import express from "express";
import AccountMovementService from "../services/account-movement.service.js";

const AccountMovementRouter = express.Router();

//Get AccountMovements
AccountMovementRouter
    .route("/")
    // Get all AccountMovements
    .get(async (req, res) => {
        const accountMovements = await AccountMovementService.getAllAccountMovements();
        res.json(accountMovements);
    })
    .post(async (req, res, next) => {
        const AccountMovementData = req.body;
        try {
            if (AccountMovementData) {
                //Movements post
                const newAccountMovement = await AccountMovementService.addAccountMovement(AccountMovementData);
                res.send(newAccountMovement);
            }
        } catch (err) {
            next(err);
        }
    });

//Get movements by origin account
AccountMovementRouter
    .route("/accounts/:originAccount")
    // Get single AccountMovement
    .get(async (req, res) => {
        const AccountMovementOriginAccount = req.params.originAccount;
        const AccountMovements = await AccountMovementService.getAccountMovementsByOriginAccount(AccountMovementOriginAccount);
        !AccountMovements ? res.sendStatus(404) : res.json(AccountMovements);
    })
//Get movements by destination account
AccountMovementRouter
    .route("/accounts/:destinationAccount")
    // Get account movements
    .get(async (req, res) => {
        const AccountMovementDestAccount = req.params.destinationAccount;
        const AccountMovements = await AccountMovementService.getAccountMovementByDestinationAccount(AccountMovementDestAccount);
        !AccountMovements ? res.sendStatus(404) : res.json(AccountMovements);
    })

//Get movements by user
AccountMovementRouter
    .route("/user/:user")
    // Get account movements
    .get(async (req, res) => {
        const user = req.params.user;
        const AccountMovements = await AccountMovementService.getAccountMovementsByUser(user);
        !AccountMovements ? res.sendStatus(404) : res.json(AccountMovements);
    })

//Routes actions with movement id
AccountMovementRouter
    .route("/:id")
    // Get single AccountMovement
    .get(async (req, res) => {
        const accountMovementId = req.params.id;
        const accountMovement = await AccountMovementService.getAccountMovementById(accountMovementId);
        !accountMovement ? res.sendStatus(404) : res.json(accountMovement);
    })
    // Update AccountMovement by giving id
    .put(async (req, res, next) => {
        const accountMovementId = req.params.id;
        const AccountMovementData = req.body;

        try {
            // find and update a AccountMovement, if no AccountMovement is found, null will be returned
            const updatedAccountMovement = await AccountMovementService.updateAccountMovement(accountMovementId, AccountMovementData);

            !updatedAccountMovement ? res.sendStatus(404) : res.json(updatedAccountMovement);
        } catch (err) {
            next(err);
        }
    })
    // Delete AccountMovement by giving id
    .delete(async (req, res) => {
        const accountMovementId = req.params.id;
        const deletedAccountMovement = await AccountMovementService.deleteAccountMovement(accountMovementId);
        !deletedAccountMovement ? res.sendStatus(404) : res.json(deletedAccountMovement);
    });

export default AccountMovementRouter;
