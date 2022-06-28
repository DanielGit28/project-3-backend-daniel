const express = require("express");
const AccountMovementService = require("../services/account-movement.service");
const BankAccountService = require("../services/bank-account.service");
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

                //REMAINING: check if is same currency

                //Accounts
                let originAccount = await BankAccountService.getBankAccountByNumber(AccountMovementData.originAccount);
                if (originAccount) {
                    //Money insertion updates origin balance
                    if (AccountMovementData.movementType === "Money insertion") {
                        await BankAccountService.updateBankAccount(originAccount.accountNumber, { accountBalance: originAccount.accountBalance + AccountMovementData.amount });
                        //Send movement once finalized the account update
                        res.send(newAccountMovement);
                    } else {
                        res.send("No movement type specified");
                    }
                    //Service updates origin balance
                    //Service payments need to action an account movement and a service post or put for the service state of the user
                    if ( AccountMovementData.movementType === "Service") {
                        await BankAccountService.updateBankAccount(originAccount.accountNumber, { accountBalance: originAccount.accountBalance - AccountMovementData.amount });
                        //Send movement once finalized the account update
                        res.send(newAccountMovement);
                    } else {
                        res.send("No movement type specified");
                    }
                    //Money transfer updates origin and destination accounts 
                    if (AccountMovementData.movementType === "Money transfer" && AccountMovementData.destinationAccount) {
                        //Origin
                        await BankAccountService.updateBankAccount(originAccount.accountNumber, { accountBalance: originAccount.accountBalance - AccountMovementData.amount });
                        //Destination
                        let destinationAccount = await BankAccountService.getBankAccountByNumber(AccountMovementData.destinationAccount);
                        await BankAccountService.updateBankAccount(destinationAccount.accountNumber, { accountBalance: destinationAccount.accountBalance + AccountMovementData.amount });
                        //Send movement once finalized the account update
                        res.send(newAccountMovement);
                    } else {
                        res.send("No destination account or movement type specified");
                    }
                } else {
                    res.send("Movement origin account not found");
                }
                
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
        const AccountMovementOriginAccount = req.params.user;
        const AccountMovements = await AccountMovementService.getAccountMovementsByOriginAccount(AccountMovementOriginAccount);
        !AccountMovements ? res.sendStatus(404) : res.json(AccountMovements);
    })
//Get movements by destination account
AccountMovementRouter
    .route("/accounts/:destinationAccount")
    // Get account movements
    .get(async (req, res) => {
        const AccountMovementDestAccount = req.params.user;
        const AccountMovements = await AccountMovementService.getAccountMovementByDestinationAccount(AccountMovementDestAccount);
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

module.exports = AccountMovementRouter;
