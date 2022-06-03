import PegiService from './PegiService.service';
import CategorController from './PegiController.controller';
import * as express from 'express';
import IAppResource from '../../common/IAppResources.interface';
import IRouter from '../../common/IRouter.interface';

class PegiRouter implements IRouter{
    public setupRoutes(app: express.Application, resaurces: IAppResource){
        const pegiService: PegiService = new PegiService(resaurces.databaseConnection);
        const pegiController: CategorController = new CategorController(pegiService);

        app.get("/api/pegi", pegiController.getAll.bind(pegiController));
        app.get("/api/pegi/:id", pegiController.getById.bind(pegiController));
    }
}

export default PegiRouter;