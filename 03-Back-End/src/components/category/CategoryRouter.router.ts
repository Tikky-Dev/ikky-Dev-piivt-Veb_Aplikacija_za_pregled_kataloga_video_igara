import CategorController from './CategoryController.controller';
import * as express from 'express';
import IAppResource from '../../common/IAppResources.interface';
import IRouter from '../../common/IRouter.interface';
import AuthMiddleware from '../../middlewares/AuthMiddleware';

class CategoryRouter implements IRouter{
    public setupRoutes(app: express.Application, resaurces: IAppResource){
        const categoryController: CategorController = new CategorController(resaurces.services);

        app.get("/api/category", categoryController.getAll.bind(categoryController));
        app.get("/api/category/:id", categoryController.getById.bind(categoryController));
        
        app.post("/api/category", AuthMiddleware.getVerifier("administrator"),categoryController.add.bind(categoryController));

        app.put("/api/category/:cid", AuthMiddleware.getVerifier("administrator"),categoryController.edit.bind(categoryController));
    }
}

export default CategoryRouter;