import CategoryService, { DefaultCategoryAdapterOptions } from './CategoryService.service';
import { Request, Response } from "express";

class CategorController{
    private categoryService: CategoryService;

    constructor(categoryService: CategoryService){
        this.categoryService = categoryService;
    }

    async getAll(req:Request, res: Response){
        this.categoryService.baseGetAll(DefaultCategoryAdapterOptions)
            .then(result => {
                res.send(result);
            })
            .catch(error => {
                return res.status(500).send(error?.message);
            });
    }

    async getById(req:Request, res: Response){
        const id: number = Number(req.params?.id);
        this.categoryService.baseGetById(id, DefaultCategoryAdapterOptions)
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
}

export default CategorController;