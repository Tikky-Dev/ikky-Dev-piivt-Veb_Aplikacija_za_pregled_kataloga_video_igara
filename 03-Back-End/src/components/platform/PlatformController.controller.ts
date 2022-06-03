import PlatformService, { DefaultPlatformAdapterOptions } from './PlatformService.service';
import { Request, Response } from "express";

class PlatformController{
    private platformService: PlatformService;

    constructor(platformService: PlatformService){
        this.platformService = platformService;
    }

    async getAll(req:Request, res: Response){
        this.platformService.baseGetAll(DefaultPlatformAdapterOptions)
            .then(result => {
                res.send(result);
            })
            .catch(error => {
                return res.status(500).send(error?.message);
            });
    }

    async getById(req:Request, res: Response){
        const id: number = Number(req.params?.id);
        this.platformService.baseGetById(id, DefaultPlatformAdapterOptions)
            .then((result) => {
                if(result === null){
                   throw {
                       status: 404,
                       message: "Platform not found!"
                   }
               }
               res.send(result);
            }).catch((error) => {
                res.status(error?.status ?? 500).send(error?.message);
            });
    }
}

export default PlatformController;