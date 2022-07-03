
import * as express from "express";
import IAppResource from "../../common/IAppResources.interface";
import IRouter from "../../common/IRouter.interface";
import AuthMiddleware from "../../middlewares/AuthMiddleware";
import AdministratorController from "./AdminController.controller";

class AdministratorRouter implements IRouter {
    public setupRoutes(application: express.Application, resources: IAppResource) {
        const administratorController: AdministratorController = new AdministratorController(resources.services);

        application.get("/api/administrator",       AuthMiddleware.getVerifier("administrator"),administratorController.getAll.bind(administratorController));
        application.get("/api/administrator/:id",   AuthMiddleware.getVerifier("administrator"),administratorController.getById.bind(administratorController));
        application.post("/api/administrator",      AuthMiddleware.getVerifier("administrator"),administratorController.add.bind(administratorController));
        application.put("/api/administrator/:aid",  AuthMiddleware.getVerifier("administrator"),administratorController.editById.bind(administratorController));
    }
}

export default AdministratorRouter;