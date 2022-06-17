import CategoryService, { DefaultCategoryAdapterOptions } from './CategoryService.service';
import { Request, Response } from "express";
import BaseController from '../../common/BaseController.controller';
import IAddCategory, { AddCategoryValidator } from './dto/IAddCategory.dto';
import { EditCategoryValidator, IEditCategoryDto } from './dto/IEditCategory.dto';
import IEditCategory from './dto/IEditCategory.dto';

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
        this.service.category.baseGetById(id, {loadGames:true})
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

    async edit(req: Request, res: Response) {
        const id: number = Number(req.params?.cid);
        const data = req.body as IEditCategoryDto;

        if (!EditCategoryValidator(data)) {
            return res.status(400).send(EditCategoryValidator.errors);
        }


        this.service.category.baseGetById(id, DefaultCategoryAdapterOptions)
        .then(result => {
            if(result === null){
                throw {
                    status: 404,
                    message: "Category not found",
                }
            }
        })
        .then(() => {

            const serviceData: IEditCategory = {};

            if(data.categoryName !== undefined){
                serviceData.category_name = data.categoryName
            }

            if(data.isActive !== undefined){
                serviceData.is_active = data.isActive ? 1:0
            }

            return this.service.category.edditById(
                id,
                serviceData,
                DefaultCategoryAdapterOptions)
        })
        .then(result => {
            res.send(result);
        })
        .catch(error => {
            res.status(400).send(error?.message);
        });
    }
}

export default CategoryController;