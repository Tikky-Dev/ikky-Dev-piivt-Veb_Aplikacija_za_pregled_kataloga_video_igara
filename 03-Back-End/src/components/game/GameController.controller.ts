import GameService, { DefaultGameAdapterOptions } from './GameService.service';
import { Request, Response } from "express";

class GameController{
    private gameService: GameService;

    constructor(gameService: GameService){
        this.gameService = gameService;
    }

    async getAll(req:Request, res: Response){
        this.gameService.baseGetAll(DefaultGameAdapterOptions)
            .then(result => {
                res.send(result);
            })
            .catch(error => {
                return res.status(500).send(error?.message);
            });
    }

    async getById(req:Request, res: Response){
        const id: number = Number(req.params?.id);
        this.gameService.baseGetById(id, DefaultGameAdapterOptions)
            .then((result) => {
                if(result === null){
                   throw {
                       status: 404,
                       message: "Game not found!"
                   }
               }
               res.send(result);
            }).catch((error) => {
                res.status(error?.status ?? 500).send(error?.message);
            });
    }
}

export default GameController;