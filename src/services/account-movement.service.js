import AccountMovement from "../models/account-movement.model.js";
import BankAccountService from "./bank-account.service.js";
import fetch from "node-fetch";

class AccountMovementService {

    static async getAllAccountMovements() {
        const accountMovements = await AccountMovement.find();
        return accountMovements;
    }

    static async getAccountMovementById(id) {
        const accountMovement = await AccountMovement.findById(id);
        return accountMovement;
    }
    static async getAccountMovementsByUser(user) {
        const accountMovement = await AccountMovement.find({ user: user });
        return accountMovement;
    }

    static async getAccountMovementsByOriginAccount(originAccount) {
        const accountMovement = await AccountMovement.find({ originAccount: originAccount });
        return accountMovement;
    }
    static async getAccountMovementByDestinationAccount(destinationAccount) {
        const accountMovement = await AccountMovement.findOne({ destinationAccount: destinationAccount });
        return accountMovement;
    }

    static async addAccountMovement(AccountMovementData) {
        const movement = await this.updateBankAccount(AccountMovementData);
        console.log("Movement: ", movement);
        if (movement === "Error on service: there are not enough funds on the account." || movement === "Error on transfer: there are not enough funds on the account.") {
            return movement;
        } else {
            const accountMovement = new AccountMovement(AccountMovementData);
            await accountMovement.save();
            return accountMovement;
        }

    }

    static async updateAccountMovement(id, newData) {
        const updatedAccountMovement = await AccountMovement.findByIdAndUpdate(id, newData, {
            returnDocument: "after",
            runValidators: true,
        });

        return updatedAccountMovement;
    }

    static async deleteAccountMovement(id) {
        const accountMovement = await AccountMovement.findByIdAndDelete(id);
        return accountMovement;
    }

    //Controller for the three types of money movements
    static async updateBankAccount(AccountMovementData) {
        let originAccount = await BankAccountService.getBankAccountByNumber(AccountMovementData.originAccount);
        let dollarChange = await this.getDollarChange();
        if (originAccount) {
            //Money insertion updates origin balance
            if (AccountMovementData.movementType === "Money insertion") {
                return await this.updateBankAccountInsertion(AccountMovementData, originAccount, dollarChange);
            } else if (AccountMovementData.movementType === "Service") {
                return await this.updateBankAccountService(AccountMovementData, originAccount, dollarChange);
            } else if (AccountMovementData.movementType === "Money transfer" && AccountMovementData.destinationAccount) {
                return await this.updateBankAccountTransfer(AccountMovementData, originAccount, dollarChange);
            }
        }
    }
    //Money insertion
    static async updateBankAccountInsertion(AccountMovementData, originAccount, dollarChange) {
        console.log(dollarChange);
        if (originAccount) {
            //Money insertion updates origin balance
            if (AccountMovementData.movementType === "Money insertion") {
                if (AccountMovementData.currency === "Dollar" && originAccount.currency === "Colon") {
                    let amountInserted = AccountMovementData.amount * dollarChange.compra;
                    await BankAccountService.updateBankAccount(originAccount.accountNumber, { accountBalance: originAccount.accountBalance + amountInserted });
                    return "Money insertion movement success.";
                } if (AccountMovementData.currency === "Colon" && originAccount.currency === "Dollar") {
                    let amountInserted = AccountMovementData.amount / dollarChange.venta;
                    await BankAccountService.updateBankAccount(originAccount.accountNumber, { accountBalance: originAccount.accountBalance + amountInserted });
                    return "Money insertion movement success.";
                } else if(AccountMovementData.currency === originAccount.currency ) {
                    let amountInserted = Number(AccountMovementData.amount);
                    await BankAccountService.updateBankAccount(originAccount.accountNumber, { accountBalance: originAccount.accountBalance + amountInserted });
                    return "Money insertion movement success.";
                }
            }
        }
    }

    //Money service payment
    static async updateBankAccountService(AccountMovementData, originAccount, dollarChange) {
        if (originAccount) {
            try {
                //Service updates origin balance
                //Service payments need to action an account movement and a service post or put for the service state of the user
                if (AccountMovementData.movementType === "Service") {
                    if (AccountMovementData.currency === "Dollar" && originAccount.currency === "Colon") {
                        if (originAccount.accountBalance > AccountMovementData.amount * dollarChange.compra) {
                            let amountInserted = AccountMovementData.amount * dollarChange.compra;
                            await BankAccountService.updateBankAccount(originAccount.accountNumber, {
                                accountBalance: originAccount.accountBalance - amountInserted
                            });
                            return "Service movement success.";
                        } else {
                            throw "Error on service: there are not enough funds on the account."
                        }

                    } if (AccountMovementData.currency === "Colon" && originAccount.currency === "Dollar") {
                        if (originAccount.accountBalance > AccountMovementData.amount / dollarChange.venta) {
                            let amountInserted = AccountMovementData.amount / dollarChange.venta;
                            await BankAccountService.updateBankAccount(originAccount.accountNumber, { accountBalance: originAccount.accountBalance - amountInserted });
                            return "Service movement success.";
                        } else {
                            throw "Error on service: there are not enough funds on the account."
                        }
                    } else if (originAccount.accountBalance > AccountMovementData.amount) {
                        await BankAccountService.updateBankAccount(originAccount.accountNumber, { accountBalance: originAccount.accountBalance - AccountMovementData.amount });
                        return "Service movement success.";
                    } else {
                        throw "Error on service: there are not enough funds on the account."
                    }
                }
            } catch (error) {
                console.log(error);
                return error;
            }
        }
    }
    //Money transfer
    static async updateBankAccountTransfer(AccountMovementData, originAccount, dollarChange) {
        if (originAccount) {
            try {
                //Money transfer updates origin and destination accounts 
                if (AccountMovementData.movementType === "Money transfer" && AccountMovementData.destinationAccount) {
                    if (AccountMovementData.currency === "Dollar" && originAccount.currency === "Colon") {
                        if (originAccount.accountBalance > AccountMovementData.amount * dollarChange.compra) {
                            //Origin
                            let amountInserted = AccountMovementData.amount * dollarChange.compra;
                            await BankAccountService.updateBankAccount(originAccount.accountNumber, { accountBalance: originAccount.accountBalance - amountInserted });
                            //Destination
                            await this.destinationAccountUpdate(AccountMovementData,dollarChange);
                            return "Transfer movement success.";
                        } else {
                            throw "Error on transfer: there are not enough funds on the account."
                        }

                    } if (AccountMovementData.currency === "Colon" && originAccount.currency === "Dollar") {
                        if (originAccount.accountBalance > AccountMovementData.amount / dollarChange.venta) {
                            //Origin
                            let amountInserted = AccountMovementData.amount / dollarChange.venta;
                            await BankAccountService.updateBankAccount(originAccount.accountNumber, { accountBalance: originAccount.accountBalance - amountInserted });
                            //Destination
                            await this.destinationAccountUpdate(AccountMovementData.dollarChange);
                            return "Transfer movement success.";
                        } else {
                            throw "Error on transfer: there are not enough funds on the account."
                        }
                    } else if (originAccount.accountBalance > AccountMovementData.amount) {
                        //Origin
                        await BankAccountService.updateBankAccount(originAccount.accountNumber, { accountBalance: originAccount.accountBalance - AccountMovementData.amount });
                        //Destination
                        await this.destinationAccountUpdate(AccountMovementData,dollarChange);
                        return "Transfer movement success.";
                    } else {
                        throw "Error on transfer: there are not enough funds on the account."
                    }

                }
            } catch (error) {
                console.log(error);
                return error;
            }
        }
    }

    static async destinationAccountUpdate(AccountMovementData, dollarChange) {
        //Destination
        let destinationAccount = await BankAccountService.getBankAccountByNumber(AccountMovementData.destinationAccount);
        if (AccountMovementData.currency === "Dollar" && destinationAccount.currency === "Colon") {
            let amountInserted = AccountMovementData.amount * dollarChange.compra;
            await BankAccountService.updateBankAccount(destinationAccount.accountNumber, { accountBalance: destinationAccount.accountBalance + amountInserted });
        } else
            if (AccountMovementData.currency === "Colon" && destinationAccount.currency === "Dollar") {
                let amountInserted = AccountMovementData.amount / dollarChange.venta;
                await BankAccountService.updateBankAccount(destinationAccount.accountNumber, { accountBalance: destinationAccount.accountBalance + amountInserted });
            } else {
                await BankAccountService.updateBankAccount(destinationAccount.accountNumber, { accountBalance: destinationAccount.accountBalance + AccountMovementData.amount });
            }
    }

    //Gets the dollar change everyday from the CENTRAL BANK
    static async getDollarChange() {
        const response = await fetch("https://tipodecambio.paginasweb.cr/api/");
        return response.json();
    }
}

export default AccountMovementService;
