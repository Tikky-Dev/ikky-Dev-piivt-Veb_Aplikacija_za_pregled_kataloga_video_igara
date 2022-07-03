import * as express from "express";
import IAppResource from "../../common/IAppResources.interface";
import IRouter from "../../common/IRouter.interface";
import AuthController from "./AuthController.controller";

class AuthRouter implements IRouter {
    public setupRoutes(application: express.Application, resources: IAppResource) {
        const authController: AuthController = new AuthController(resources.services);

        application.post("/api/auth/administrator/login",         authController.administratorLogin.bind(authController));
        application.post("/api/auth/administrator/refresh",       authController.administratorRefresh.bind(authController));

        application.post("/api/auth/user/login",                  authController.userLogin.bind(authController));
        application.post("/api/auth/user/refresh",                authController.userRefresh.bind(authController));
    }
}

export default AuthRouter;