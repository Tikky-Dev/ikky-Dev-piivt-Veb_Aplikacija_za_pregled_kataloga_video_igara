import GameService, { DefaultGameAdapterOptions } from './GameService.service';
import { Request, Response } from "express";
import BaseController from '../../common/BaseController.controller';
import IAddGame, { AddGameValidator } from './dto/IAddGame.dto';
import IEditGame, { EditGameValidator, IEditGameDto } from './dto/IEditGame.dto';

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
        this.service.game.baseGetById(id, {
                loadCategories: true,
                loadPlatforms: true,
            })
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


    async add(req: Request, res: Response) {
        const data = req.body as IAddGame;

        if (!AddGameValidator(data)) {
            return res.status(400).send(AddGameValidator.errors);
        }

        this.service.game.add(data)
        .then(result => {
            res.send(result);
        })
        .catch(error => {
            res.status(400).send(error?.message);
        });
    }

    async edit(req: Request, res: Response) {
        const id: number = Number(req.params?.id);
        const data = req.body as IEditGameDto;

        if (!EditGameValidator(data)) {
            return res.status(400).send(EditGameValidator.errors);
        }


        this.service.game.baseGetById(id, DefaultGameAdapterOptions)
        .then(result => {
            if(result === null){
                throw {
                    status: 404,
                    message: "Game not found",
                }
            }
        })
        .then(() => {

            const serviceData: IEditGame = {};

            if(data.title !== undefined){
                serviceData.title = data.title
            }

            if(data.publisher !== undefined){
                serviceData.publisher = data.publisher
            }

            if(data.publishYear !== undefined){
                serviceData.publish_year = data.publishYear
            }
            
            if(data.description !== undefined){
                serviceData.title = data.description
            }

            if(data.price !== undefined){
                serviceData.price = data.price
            }


            if(data.pegiId !== undefined){
                serviceData.pegi_id = data.pegiId
            }

            if(data.isActive !== undefined){
                serviceData.is_active = data.isActive ? 1:0
            }

            return this.service.game.edditById(
                id,
                serviceData,
                DefaultGameAdapterOptions)
        })
        .then(result => {
            res.send(result);
        })
        .catch(error => {
            res.status(400).send(error?.message);
        });
    }


    async addCategoryToGame(req: Request, res:Response){
        const gameId: number = Number(req.params?.gid);
        const categoryId: number = Number(req.params?.cid);

        this.service.game.addNewCategoryToTheGame(gameId, categoryId)
        .then(result => {
            res.status(200).send(result);
        })
        .catch(error => {
            res.status(400).send(error?.message);
        });
    }

    async deleteCategoryFromGame(req: Request, res:Response){
        const gameId: number = Number(req.params?.gid);
        const categoryId: number = Number(req.params?.pid);

        this.service.game.deleteCategoryFromTheGame(gameId, categoryId)
        .then(result => {
            res.status(200).send(result);
        })
        .catch(error => {
            res.status(400).send(error?.message);
        });
    }


    async addPlatformToGame(req: Request, res:Response){
        const gameId: number = Number(req.params?.gid);
        const platformId: number = Number(req.params?.pid);

        this.service.game.addNewPlatformToTheGame(gameId, platformId)
        .then(result => {
            res.status(200).send(result);
        })
        .catch(error => {
            res.status(400).send(error?.message);
        });
    }

    async deletePlatformFromGame(req: Request, res:Response){
        const gameId: number = Number(req.params?.gid);
        const platformId: number = Number(req.params?.pid);

        this.service.game.deletePlatformFromTheGame(gameId, platformId)
        .then(result => {
            res.status(200).send(result);
        })
        .catch(error => {
            res.status(400).send(error?.message);
        });
    }
}

export default GameController;