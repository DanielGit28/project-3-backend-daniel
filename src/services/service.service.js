import Service from "../models/service.model.js";
import AccountMovementService from "./account-movement.service.js";

class ServiceService {

    static async getAllServices() {
        const services = await Service.find();
        return services;
    }

    static async getServiceById(id) {
        const service = await Service.findById(id);
        return service;
    }

    static async getServicesByUser(user) {
        const service = await Service.find({ user: user });
        return service;
    }

    static async addService(ServiceData) {
        let movement = {
            originAccount: ServiceData.bankAccount,
            currency: ServiceData.currency,
            amount: ServiceData.amount,
            movementType: "Service",
            user: ServiceData.user
        }
        const movementResponse = await AccountMovementService.addAccountMovement(movement);
        if (movementResponse === "Error on service: there are not enough funds on the account." || movementResponse === "Error on transfer: there are not enough funds on the account.") {
            return movementResponse;
        } else {
            const service = new Service(ServiceData);
            await service.save();
            return service;
        }

    }

    static async updateService(id, newData) {
        const updatedService = await Service.findByIdAndUpdate(id, newData, {
            returnDocument: "after",
            runValidators: true,
        });
        let movement = {
            originAccount: newData.bankAccount,
            currency: newData.currency,
            amount: newData.amount,
            movementType: "Service"
        }
        await AccountMovementService.addAccountMovement(movement);

        return updatedService;
    }

    static async deleteService(id) {
        const service = await Service.findByIdAndDelete(id);

        return service;
    }

}

export default ServiceService;
