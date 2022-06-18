import { DefaultPlatformAdapterOptions } from './PlatformService.service';
import { Request, Response } from "express";
import BaseController from '../../common/BaseController.controller';
import IAddPlatform, { AddPlatformValidator } from './dto/IAddPlatform.dto';
import IEditPlatform, { EditPlatformValidator, IEditPlatformDto } from './dto/IEditPlatform.dto';

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
        this.service.platform.baseGetById(id, {loadGames: true})
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

    async add(req: Request, res: Response) {
        const data = req.body as IAddPlatform;

        if (!AddPlatformValidator(data)) {
            return res.status(400).send(AddPlatformValidator.errors);
        }

        this.service.platform.add(data)
        .then(result => {
            res.send(result);
        })
        .catch(error => {
            res.status(400).send(error?.message);
        });
    }

    async edit(req: Request, res: Response) {
        const id: number = Number(req.params?.id);
        const data = req.body as IEditPlatformDto;

        if (!EditPlatformValidator(data)) {
            return res.status(400).send(EditPlatformValidator.errors);
        }


        this.service.platform.baseGetById(id, DefaultPlatformAdapterOptions)
        .then(result => {
            if(result === null){
                throw {
                    status: 404,
                    message: "Platform not found",
                }
            }
        })
        .then(() => {

            const serviceData: IEditPlatform = {};

            if(data.platformName !== undefined){
                serviceData.platform_name = data.platformName
            }

            if(data.isActive !== undefined){
                serviceData.is_active = data.isActive ? 1:0
            }

            return this.service.platform.editById(
                id,
                serviceData,
                DefaultPlatformAdapterOptions)
        })
        .then(result => {
            res.send(result);
        })
        .catch(error => {
            res.status(400).send(error?.message);
        });
    }
}

export default PlatformController;