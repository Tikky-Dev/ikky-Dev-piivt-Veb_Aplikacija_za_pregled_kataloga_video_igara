import PlatformService from './PlatformService.service';
import CategorController from './PlatformController.controller';
import * as express from 'express';
import IAppResource from '../../common/IAppResources.interface';
import IRouter from '../../common/IRouter.interface';
import AuthMiddleware from '../../middlewares/AuthMiddleware';

class PlatformRouter implements IRouter{
    public setupRoutes(app: express.Application, resaurces: IAppResource){
        const platformController: CategorController = new CategorController(resaurces.services);

        app.get("/api/platform", platformController.getAll.bind(platformController));
        app.get("/api/platform/:id", platformController.getById.bind(platformController));
    
        app.post("/api/platform", AuthMiddleware.getVerifier("administrator"),platformController.add.bind(platformController));

        app.put("/api/platform/:id", AuthMiddleware.getVerifier("administrator"),platformController.edit.bind(platformController));
    }
}

export default PlatformRouter;