import CategoryService from './CategoryService.service';
import { Request, Response } from "express";

class CategorController{
    private categoryService: CategoryService;

    constructor(categoryService: CategoryService){
        this.categoryService = categoryService;
    }

    async getAll(req:Request, res: Response){
        res.send(await this.categoryService.getAll());
        this.categoryService.getAll()
            .then(result => {
                res.send(result);
            })
            .catch(error => {
                res.status(500).send(error?.message);
            });
    }

    async getById(req:Request, res: Response){
        const id: number = Number(req.params?.id);
        const category = await this.categoryService.getById(id);
        
        if(category === null){
            return res.sendStatus(404);
        }
        
        res.send(category);
    }
}

export default CategorController;