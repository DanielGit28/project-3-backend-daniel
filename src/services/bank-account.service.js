const BankAccount = require("../models/bank-account.model");

class BankAccountService {

    static async getAllBankAccounts() {
        const BankAccounts = await BankAccount.find();
        return BankAccounts;
    }

    static async getBankAccountById(id) {
        const bankAccount = await BankAccount.findById(id);
        return bankAccount;
    }

    static async getBankAccountsByUser(user) {
        const bankAccount = await BankAccount.find({ user: user });
        return bankAccount;
    }
    static async getBankAccountByNumber(number) {
        const bankAccount = await BankAccount.findOne({ accountNumber: number });
        return bankAccount;
    }

    static async addBankAccount(BankAccountData) {
        const bankAccount = new BankAccount(BankAccountData);

        await bankAccount.save();

        return bankAccount;
    }

    static async updateBankAccount(number, newData) {
        const updatedBankAccount = await BankAccount.findOneAndUpdate({ accountNumber: number }, newData, {
            returnDocument: "after",
            runValidators: true,
        });

        return updatedBankAccount;
    }

    static async deleteBankAccount(number) {
        const bankAccount = await BankAccount.findOneAndDelete({ accountNumber: number });

        return bankAccount;
    }
}

module.exports = BankAccountService;
