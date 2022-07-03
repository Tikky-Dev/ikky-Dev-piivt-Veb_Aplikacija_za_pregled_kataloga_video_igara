import * as express from "express";
import IAppResource from "../../common/IAppResources.interface";
import IRouter from "../../common/IRouter.interface";
import AuthMiddleware from "../../middlewares/AuthMiddleware";
import UserController from "./UserController.controller";

class UserRouter implements IRouter {
    public setupRoutes(application: express.Application, resources: IAppResource) {
        const userController: UserController = new UserController(resources.services);

        application.get("/api/user",                 AuthMiddleware.getVerifier("administrator"),userController.getAll.bind(userController));
        application.get("/api/user/:id",             AuthMiddleware.getVerifier("administrator", "user"),userController.getById.bind(userController));
        application.get("/api/user/activate/:code",  AuthMiddleware.getVerifier("user"),userController.activate.bind(userController));
        application.get("/api/user/reset/:code",     AuthMiddleware.getVerifier("user"),userController.resetPassword.bind(userController));

        application.post("/api/user/register",       userController.register.bind(userController));
        application.post("/api/user/resetPassword",  userController.passwordResetEmailSend.bind(userController));
        application.post("/api/user/addReview",      AuthMiddleware.getVerifier("user"),userController.addReview.bind(userController));

        application.put("/api/user/:aid",            AuthMiddleware.getVerifier("administrator", "user"),userController.editById.bind(userController));
        application.put("/api/user/review/:rid",     AuthMiddleware.getVerifier("administrator", "user"),userController.editReviewById.bind(userController));
    }
}

export default UserRouter;