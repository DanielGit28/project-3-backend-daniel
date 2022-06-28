import express from"express";
import BankAccountService from"../services/bank-account.service.js";
const BankAccountRouter = express.Router();

//Get BankAccounts
BankAccountRouter
    .route("/accounts")
    // Get all BankAccounts
    .get(async (req, res) => {
        const BankAccounts = await BankAccountService.getAllBankAccounts();
        res.json(BankAccounts);
    })
    .post(async (req, res, next) => {
        const BankAccountData = req.body;
        try {
            if (BankAccountData) {
                let IBANNumber = "CR610100"+Math.floor(Math.pow(10, 14-1) + Math.random() * 9 * Math.pow(10, 14-1));
                BankAccountData.accountNumber = IBANNumber;
                const newBankAccount = await BankAccountService.addBankAccount(BankAccountData);
                res.send(newBankAccount);
            }
        } catch (err) {
            next(err);
        }
    });

//Get accounts by user
BankAccountRouter
    .route("/user/:user")
    // Get single BankAccount
    .get(async (req, res) => {
        const BankAccountUser = req.params.user;
        const BankAccount = await BankAccountService.getBankAccountsByUser(BankAccountUser);
        !BankAccount ? res.sendStatus(404) : res.json(BankAccount);
    })

//Routes actions with account number
BankAccountRouter
    .route("/accounts/:accountNumber")
    // Get single BankAccount
    .get(async (req, res) => {
        const BankAccountNumber = req.params.accountNumber;
        const BankAccount = await BankAccountService.getBankAccountByNumber(BankAccountNumber);
        !BankAccount ? res.sendStatus(404) : res.json(BankAccount);
    })
    // Update BankAccount by giving id
    .put(async (req, res, next) => {
        const BankAccountNumber = req.params.accountNumber;
        const BankAccountData = req.body;

        try {
            // find and update a BankAccount, if no BankAccount is found, null will be returned
            const updatedBankAccount = await BankAccountService.updateBankAccount(BankAccountNumber, BankAccountData);

            !updatedBankAccount ? res.sendStatus(404) : res.json(updatedBankAccount);
        } catch (err) {
            next(err);
        }
    })
    // Delete BankAccount by giving id
    .delete(async (req, res) => {
        const BankAccountNumber = req.params.accountNumber;
        // find and delete a BankAccount, if no BankAccount is found, null will be returned
        const deletedBankAccount = await BankAccountService.deleteBankAccount(BankAccountNumber);
        !deletedBankAccount ? res.sendStatus(404) : res.json(deletedBankAccount);
    });

export default BankAccountRouter;
