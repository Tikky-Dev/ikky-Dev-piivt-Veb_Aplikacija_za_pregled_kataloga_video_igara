import * as express from 'express';
import IAppResource from '../../common/IAppResources.interface';
import IRouter from '../../common/IRouter.interface';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import ReviewController from './ReviewController.controller';

class ReviewRouter implements IRouter{
    public setupRoutes(app: express.Application, resaurces: IAppResource){
        const reviewController: ReviewController = new ReviewController(resaurces.services);

        app.get("/api/review", AuthMiddleware.getVerifier("administrator"),reviewController.getAll.bind(reviewController));
    }
}

export default ReviewRouter;