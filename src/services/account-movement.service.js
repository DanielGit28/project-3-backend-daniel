const AccountMovement = require("../models/account-movement.model");

class AccountMovementService {

    static async getAllAccountMovements() {
        const accountMovements = await AccountMovement.find();
        return accountMovements;
    }

    static async getAccountMovementById(id) {
        const accountMovement = await AccountMovement.findById(id);
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
        const accountMovement = new AccountMovement(AccountMovementData);
        await accountMovement.save();
        
        return accountMovement;
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
}

module.exports = AccountMovementService;
