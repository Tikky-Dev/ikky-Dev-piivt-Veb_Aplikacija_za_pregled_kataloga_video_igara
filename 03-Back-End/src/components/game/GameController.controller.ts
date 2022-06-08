import GameService, { DefaultGameAdapterOptions } from './GameService.service';
import { Request, Response } from "express";
import BaseController from '../../common/BaseController.controller';

class GameController extends BaseController{

    async getAll(req:Request, res: Response){
        this.service.game.baseGetAll(DefaultGameAdapterOptions)
            .then(result => {
                res.send(result);
            })
            .catch(error => {
                return res.status(500).send(error?.message);
            });
    }

    async getById(req:Request, res: Response){
        const id: number = Number(req.params?.id);
        this.service.game.baseGetById(id, DefaultGameAdapterOptions)
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