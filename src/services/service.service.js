const Service = require("../models/service.model");

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
        const service = new Service(ServiceData);

        await service.save();

        return service;
    }

    static async updateService(id, newData) {
        const updatedService = await Service.findByIdAndUpdate(id, newData, {
            returnDocument: "after",
            runValidators: true,
        });

        return updatedService;
    }

    static async deleteService(id) {
        const service = await Service.findByIdAndDelete(id);

        return service;
    }
}

module.exports = ServiceService;
