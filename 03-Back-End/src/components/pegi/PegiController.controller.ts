import PegiService, { DefaultPegiAdapterOptions } from './PegiService.service';
import { Request, Response } from "express";
import BaseController from '../../common/BaseController.controller';
import IAddPegi, { AddPegiValidator } from './dto/IAddPegi.dto';
import { EditPegiValidator, IEditPegiDto } from './dto/IEditPegi.dto';
import IEditPegi from './dto/IEditPegi.dto';

class PegiController extends BaseController{

    async getAll(req:Request, res: Response){
        this.service.pegi.baseGetAll(DefaultPegiAdapterOptions)
            .then(result => {
                res.send(result);
            })
            .catch(error => {
                return res.status(500).send(error?.message);
            });
    }

    async getById(req:Request, res: Response){
        const id: number = Number(req.params?.id);
        this.service.pegi.baseGetById(id, {loadGames: true,})
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


    async add(req: Request, res: Response) {
        const data = req.body as IAddPegi;

        if (!AddPegiValidator(data)) {
            return res.status(400).send(AddPegiValidator.errors);
        }

        this.service.pegi.add(data)
        .then(result => {
            res.send(result);
        })
        .catch(error => {
            res.status(400).send(error?.message);
        });
    }

    async edit(req: Request, res: Response) {
        const id: number = Number(req.params?.id);
        const data = req.body as IEditPegiDto;

        if (!EditPegiValidator(data)) {
            return res.status(400).send(EditPegiValidator.errors);
        }


        this.service.pegi.baseGetById(id, DefaultPegiAdapterOptions)
        .then(result => {
            if(result === null){
                throw {
                    status: 404,
                    message: "Pegi not found",
                }
            }
        })
        .then(() => {

            const serviceData: IEditPegi = {};

            if(data.pegiName !== undefined){
                serviceData.name = data.pegiName
            }

            if(data.pegiDescription !== undefined){
                serviceData.description = data.pegiDescription
            }

            if(data.isActive !== undefined){
                serviceData.is_active = data.isActive ? 1:0
            }

            return this.service.pegi.edditById(
                id,
                serviceData,
                DefaultPegiAdapterOptions)
        })
        .then(result => {
            res.send(result);
        })
        .catch(error => {
            res.status(400).send(error?.message);
        });
    }
}

export default PegiController;