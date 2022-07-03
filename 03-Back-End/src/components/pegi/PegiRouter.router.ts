import PegiService from './PegiService.service';
import CategorController from './PegiController.controller';
import * as express from 'express';
import IAppResource from '../../common/IAppResources.interface';
import IRouter from '../../common/IRouter.interface';
import AuthMiddleware from '../../middlewares/AuthMiddleware';

class PegiRouter implements IRouter{
    public setupRoutes(app: express.Application, resaurces: IAppResource){
        const pegiController: CategorController = new CategorController(resaurces.services);

        app.get("/api/pegi", pegiController.getAll.bind(pegiController));
        app.get("/api/pegi/:id", pegiController.getById.bind(pegiController));

        app.post("/api/pegi", AuthMiddleware.getVerifier("administrator"),pegiController.add.bind(pegiController));

        app.put("/api/pegi/:id", AuthMiddleware.getVerifier("administrator"),pegiController.edit.bind(pegiController));
    }
}

export default PegiRouter;