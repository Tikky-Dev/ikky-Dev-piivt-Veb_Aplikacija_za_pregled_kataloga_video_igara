import GameService from './GameService.service';
import CategorController from './GameController.controller';
import * as express from 'express';
import IAppResource from '../../common/IAppResources.interface';
import IRouter from '../../common/IRouter.interface';

class GameRouter implements IRouter{
    public setupRoutes(app: express.Application, resaurces: IAppResource){
        const gameService: GameService = new GameService(resaurces.databaseConnection);
        const gameController: CategorController = new CategorController(gameService);

        app.get("/api/game", gameController.getAll.bind(gameController));
        app.get("/api/game/:id", gameController.getById.bind(gameController));
    }
}

export default GameRouter;