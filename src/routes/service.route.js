import express from"express";
import ServiceService from"../services/service.service.js";
const ServiceRouter = express.Router();

//Get Services
ServiceRouter
    .route("/")
    // Get all Services
    .get(async (req, res) => {
        const Services = await ServiceService.getAllServices();
        res.json(Services);
    })
    //Service first time payments are made separately
    .post(async (req, res, next) => {
        const ServiceData = req.body;
        try {
            if (ServiceData) {
                const newService = await ServiceService.addService(ServiceData);
                res.JSON(newService);
            }
        } catch (err) {
            next(err);
        }
    });

//Get accounts by user
ServiceRouter
    .route("/user/:user")
    // Get single Service
    .get(async (req, res) => {
        const ServiceUser = req.params.user;
        const Service = await ServiceService.getServicesByUser(ServiceUser);
        !Service ? res.sendStatus(404) : res.json(Service);
    })

//Routes actions with service id
ServiceRouter
    .route("/:id")
    // Get single Service
    .get(async (req, res) => {
        const ServiceId = req.params.id;
        const Service = await ServiceService.getServiceById(ServiceId);
        !Service ? res.sendStatus(404) : res.json(Service);
    })
    // Update Service by giving id
    .put(async (req, res, next) => {
        const ServiceId = req.params.id;
        const ServiceData = req.body;

        try {
            // find and update a Service, if no Service is found, null will be returned
            const updatedService = await ServiceService.updateService(ServiceId, ServiceData);

            !updatedService ? res.sendStatus(404) : res.json(updatedService);
        } catch (err) {
            next(err);
        }
    })
    // Delete Service by giving id
    .delete(async (req, res) => {
        const ServiceId = req.params.id;
        const deletedService = await ServiceService.deleteService(ServiceId);
        !deletedService ? res.sendStatus(404) : res.json(deletedService);
    });


    export default ServiceRouter;
