import PegiService, { DefaultPegiAdapterOptions } from './PegiService.service';
import { Request, Response } from "express";

class PegiController{
    private pegiService: PegiService;

    constructor(pegiService: PegiService){
        this.pegiService = pegiService;
    }

    async getAll(req:Request, res: Response){
        this.pegiService.baseGetAll(DefaultPegiAdapterOptions)
            .then(result => {
                res.send(result);
            })
            .catch(error => {
                return res.status(500).send(error?.message);
            });
    }

    async getById(req:Request, res: Response){
        const id: number = Number(req.params?.id);
        this.pegiService.baseGetById(id, DefaultPegiAdapterOptions)
            .then((result) => {
                if(result === null){
                   throw {
                       status: 404,
                       message: "Pegi not found!"
                   }
               }
               res.send(result);
            }).catch((error) => {
                res.status(error?.status ?? 500).send(error?.message);
            });
    }
}

export default PegiController;