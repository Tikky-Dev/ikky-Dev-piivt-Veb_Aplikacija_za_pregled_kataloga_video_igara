import PlatformService, { DefaultPlatformAdapterOptions } from './PlatformService.service';
import { Request, Response } from "express";
import BaseService from '../../common/BaseService.service';
import BaseController from '../../common/BaseController.controller';

class PlatformController extends BaseController{

    async getAll(req:Request, res: Response){
        this.service.platform.baseGetAll(DefaultPlatformAdapterOptions)
            .then(result => {
                res.send(result);
            })
            .catch(error => {
                return res.status(500).send(error?.message);
            });
    }

    async getById(req:Request, res: Response){
        const id: number = Number(req.params?.id);
        this.service.platform.baseGetById(id, DefaultPlatformAdapterOptions)
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