import PegiService from './PegiService.service';
import CategorController from './PegiController.controller';
import * as express from 'express';
import IAppResource from '../../common/IAppResources.interface';
import IRouter from '../../common/IRouter.interface';

class PegiRouter implements IRouter{
    public setupRoutes(app: express.Application, resaurces: IAppResource){
        const pegiController: CategorController = new CategorController(resaurces.services);

        app.get("/api/pegi", pegiController.getAll.bind(pegiController));
        app.get("/api/pegi/:id", pegiController.getById.bind(pegiController));

        app.post("/api/pegi", pegiController.add.bind(pegiController));

        app.put("/api/pegi/:id", pegiController.edit.bind(pegiController));
    }
}

export default PegiRouter;