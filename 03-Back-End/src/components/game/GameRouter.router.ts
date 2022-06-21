import CategorController from './GameController.controller';
import * as express from 'express';
import IAppResource from '../../common/IAppResources.interface';
import IRouter from '../../common/IRouter.interface';

class GameRouter implements IRouter{
    public setupRoutes(app: express.Application, resaurces: IAppResource){
        const gameController: CategorController = new CategorController(resaurces.services);

        app.get("/api/game",                              gameController.getAll.bind(gameController));
        app.get("/api/game/:id",                          gameController.getById.bind(gameController));

        app.post("/api/game",                             gameController.add.bind(gameController));
        app.post("/api/game/:gid/category/:cid",          gameController.addCategoryToGame.bind(gameController));
        app.post("/api/game/:gid/platform/:pid",          gameController.addPlatformToGame.bind(gameController));
        app.post("/api/game/:gid/photo",                  gameController.uploadPhoto.bind(gameController));

        app.put("/api/game/:id",                          gameController.edit.bind(gameController));
        app.put("/api/photo/:id/delete",                  gameController.deletePhoto.bind(gameController));
        
        app.delete("/api/game/:gid/category/:cid/delete", gameController.deleteCategoryFromGame.bind(gameController));
        app.delete("/api/game/:gid/platform/:pid/delete", gameController.deletePlatformFromGame.bind(gameController));

    }
}

export default GameRouter;