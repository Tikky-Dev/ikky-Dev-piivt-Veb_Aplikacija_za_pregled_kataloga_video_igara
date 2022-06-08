import CategoryService, { DefaultCategoryAdapterOptions } from './CategoryService.service';
import { Request, Response } from "express";
import BaseController from '../../common/BaseController.controller';
import IAddCategory, { AddCategoryValidator } from './dto/IAddCategory.dto';

class CategoryController extends BaseController{
    

    async getAll(req:Request, res: Response){
        this.service.category.baseGetAll(DefaultCategoryAdapterOptions)
            .then(result => {
                res.send(result);
            })
            .catch(error => {
                return res.status(500).send(error?.message);
            });
    }

    async getById(req:Request, res: Response){
        const id: number = Number(req.params?.id);
        this.service.category.baseGetById(id, DefaultCategoryAdapterOptions)
            .then((result) => {
                if(result === null){
                   throw {
                       status: 404,
                       message: "Category not found!"
                   }
               }
               res.send(result);
            }).catch((error) => {
                res.status(error?.status ?? 500).send(error?.message);
            });
    }


    async add(req: Request, res: Response) {
        const data = req.body as IAddCategory;

        if (!AddCategoryValidator(data)) {
            return res.status(400).send(AddCategoryValidator.errors);
        }

        this.service.category.add(data)
        .then(result => {
            res.send(result);
        })
        .catch(error => {
            res.status(400).send(error?.message);
        });
    }
}

export default CategoryController;