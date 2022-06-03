import PlatformService from './PlatformService.service';
import CategorController from './PlatformController.controller';
import * as express from 'express';
import IAppResource from '../../common/IAppResources.interface';
import IRouter from '../../common/IRouter.interface';

class PlatformRouter implements IRouter{
    public setupRoutes(app: express.Application, resaurces: IAppResource){
        const platformService: PlatformService = new PlatformService(resaurces.databaseConnection);
        const platformController: CategorController = new CategorController(platformService);

        app.get("/api/platform", platformController.getAll.bind(platformController));
        app.get("/api/platform/:id", platformController.getById.bind(platformController));
    }
}

export default PlatformRouter;