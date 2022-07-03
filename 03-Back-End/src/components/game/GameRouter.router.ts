import CategorController from './GameController.controller';
import * as express from 'express';
import IAppResource from '../../common/IAppResources.interface';
import IRouter from '../../common/IRouter.interface';
import AuthMiddleware from '../../middlewares/AuthMiddleware';

class GameRouter implements IRouter{
    public setupRoutes(app: express.Application, resaurces: IAppResource){
        const gameController: CategorController = new CategorController(resaurces.services);

        app.get("/api/game",                              gameController.getAll.bind(gameController));
        app.get("/api/game/:id",                          gameController.getById.bind(gameController));

        app.post("/api/game",                             AuthMiddleware.getVerifier("administrator"),gameController.add.bind(gameController));
        app.post("/api/game/:gid/category/:cid",          AuthMiddleware.getVerifier("administrator"),gameController.addCategoryToGame.bind(gameController));
        app.post("/api/game/:gid/platform/:pid",          AuthMiddleware.getVerifier("administrator"),gameController.addPlatformToGame.bind(gameController));
        app.post("/api/game/:gid/photo",                  AuthMiddleware.getVerifier("administrator"),gameController.uploadPhoto.bind(gameController));

        app.put("/api/game/:id",                          AuthMiddleware.getVerifier("administrator"),gameController.edit.bind(gameController));
        app.put("/api/photo/:id/delete",                  AuthMiddleware.getVerifier("administrator"),gameController.deletePhoto.bind(gameController));
        
        app.delete("/api/game/:gid/category/:cid/delete", AuthMiddleware.getVerifier("administrator"),gameController.deleteCategoryFromGame.bind(gameController));
        app.delete("/api/game/:gid/platform/:pid/delete", AuthMiddleware.getVerifier("administrator"),gameController.deletePlatformFromGame.bind(gameController));

    }
}

export default GameRouter;