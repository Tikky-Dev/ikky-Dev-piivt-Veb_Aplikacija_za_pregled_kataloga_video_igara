import { Request, Response } from "express";
import * as bcrypt from "bcrypt";
import BaseController from "../../common/BaseController.controller";
import { AddAdministratorValidator, IAddAdministratorDto } from "./dto/IAddAdmin.dto";
import IEditAdministrator, { EditAdministratorValidator, IEditAdministratorDto } from "./dto/IEditAdmin.dto";

export default class AdministratorController extends BaseController {
    getAll(req: Request, res: Response) {
        this.service.administrator.baseGetAll({
            removePassword: true,
        })
        .then(result => {
            res.send(result);
        })
        .catch(error => {
            res.status(500).send(error?.message);
        });
    }

    getById(req: Request, res: Response) {
        const id: number = +req.params?.id;

        this.service.administrator.baseGetById(id, {
            removePassword: true,
        })
        .then(result => {
            if (result === null) {
                res.status(404).send('Administrator not found!');
            }
    
            res.send(result);
        })
        .catch(error => {
            res.status(500).send(error?.message);
        });
    }

    add(req: Request, res: Response) {
        const body = req.body as IAddAdministratorDto;

        if (!AddAdministratorValidator(body)) {
            return res.status(400).send(AddAdministratorValidator.errors);
        }

        const passwordHash = bcrypt.hashSync(body.password, 10);

        this.service.administrator.add({
            username: body.username,
            password_hash: passwordHash,
        })
        .then(result => {
            res.send(result);
        })
        .catch(error => {
            res.status(500).send(error?.message);
        });
    }

    editById(req: Request, res: Response) {
        const id: number = +req.params?.aid;
        const data = req.body as IEditAdministratorDto;

        if (!EditAdministratorValidator(data)) {
            return res.status(400).send(EditAdministratorValidator.errors);
        }

        const serviceData: IEditAdministrator = { };

        if (data.password !== undefined) {
            const passwordHash = bcrypt.hashSync(data.password, 10);
            serviceData.password_hash = passwordHash;
        }

        if (data.isActive !== undefined) {
            serviceData.is_active = data.isActive ? 1 : 0;
        }

        this.service.administrator.edit(id, serviceData)
        .then(result => {
            res.send(result);
        })
        .catch(error => {
            res.status(500).send(error?.message);
        });
    }
}