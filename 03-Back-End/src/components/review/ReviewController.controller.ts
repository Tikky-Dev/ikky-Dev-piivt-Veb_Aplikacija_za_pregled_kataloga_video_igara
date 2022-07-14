import BaseController from "../../common/BaseController.controller";
import { DefaultReviewAdapterOptions } from "./ReviewService.service";
import { Request, Response } from "express";

class ReviewController extends BaseController{

    async getAll(req:Request, res: Response){
        this.service.review.baseGetAll(DefaultReviewAdapterOptions)
            .then(result => {
                res.send(result);
            })
            .catch(error => {
                return res.status(500).send(error?.message);
            });
    }
}

export default ReviewController;