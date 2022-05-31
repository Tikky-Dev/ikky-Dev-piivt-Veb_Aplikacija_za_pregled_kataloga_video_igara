import CategoryService from './CategoryService.service';
import CategorController from './CategoryController.controller';
import * as express from 'express';
import IAppResource from '../../common/IAppResources.interface';

class CategoryRouter{
    public static setupRoutes(app: express.Application, resaurces: IAppResource){
        const categoryService: CategoryService = new CategoryService(resaurces.databaseConnection);
        const categoryController: CategorController = new CategorController(categoryService);

        app.get("/api/category", categoryController.getAll.bind(categoryController));
        app.get("/api/category/:id", categoryController.getById.bind(categoryController));
    }
}

export default CategoryRouter;