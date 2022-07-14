import * as express from 'express';
import IAppResource from '../../common/IAppResources.interface';
import IRouter from '../../common/IRouter.interface';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import PlatformController from './PlatformController.controller';

class PlatformRouter implements IRouter{
    public setupRoutes(app: express.Application, resaurces: IAppResource){
        const platformController: PlatformController = new PlatformController(resaurces.services);

        app.get("/api/platform", platformController.getAll.bind(platformController));
        app.get("/api/platform/:id", platformController.getById.bind(platformController));
    
        app.post("/api/platform", AuthMiddleware.getVerifier("administrator"),platformController.add.bind(platformController));

        app.put("/api/platform/:id", AuthMiddleware.getVerifier("administrator"),platformController.edit.bind(platformController));
    }
}

export default PlatformRouter;