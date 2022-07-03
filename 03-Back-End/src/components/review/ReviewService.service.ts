import BaseService from '../../common/BaseService.service';
import IAdapterOptions from '../../common/IAdapterOptions.interface';
import { IGameAdapterOptions } from "../game/GameService.service";
import { IUserAdapterOptions } from '../user/UserService.service';
import IAddReview from './dto/IAddReview.dto';
import IEditReview from './dto/IEditReview.dto';
import ReviewModel from './ReviewModel.model';

interface IReviewAdapterOptions extends IAdapterOptions{
    loadGames: boolean;
    loadUser: boolean;
}

const DefaultReviewAdapterOptions: IReviewAdapterOptions = {
    loadGames:false,
    loadUser: false,
}

class ReviewService extends BaseService<ReviewModel, IReviewAdapterOptions>{
    tableName(): string {
        return "review"
    }



    protected async adaptToModel(data: any, options: IReviewAdapterOptions): Promise<ReviewModel>{
        const review: ReviewModel = new ReviewModel();

        review.reviewId = Number(data?.review_id);
        review.rating = Number(data?.rating);
        review.comment = data?.comment;
        review.isAproved = data?.is_approved=== 1;
        review.isActive = data?.is_active === 1;
        
        review.gameId = Number(data?.game_id);
        review.userId = Number(data?.user_id);

        return review;
    }


    public async add(data: IAddReview): Promise<ReviewModel> {
        return this.baseAdd(data, DefaultReviewAdapterOptions);
    }

    public async edditById(reviewId: number, data: IEditReview, options: IReviewAdapterOptions = DefaultReviewAdapterOptions): Promise<ReviewModel>{
        return this.baseEditById(reviewId, data,options);
    }

    public async getAllByGameId(gameId: number, options: IGameAdapterOptions): Promise<ReviewModel[]>{
        return new Promise((resolve, reject) => {
            this.baseGetAllFromTableByFieldNameAndValue<{
                review_id: number,
                game_id: number,
                user_id: number,
            }>("review", "game_id", gameId)
            .then(async result => {
                if(result.length === 0){
                    return resolve([]);
                }

                const reviews: ReviewModel[] = await Promise.all(
                    result.map(async row => {
                        const review = await (await this.baseGetById(row.review_id, DefaultReviewAdapterOptions));

                        return {
                            reviewId: row.review_id,
                            rating: review.rating,
                            comment: review.comment,
                            gameId: row.game_id,
                            userId: row.user_id,
                            isAproved: review.isAproved,
                            isActive: review.isActive
                        }

                    })
                );

                resolve(reviews);
            })
            .catch(error => {
                reject(error);
            });
        });
    }


    public async getAllByUserId(userId: number, options: IUserAdapterOptions): Promise<ReviewModel[]>{
        return new Promise((resolve, reject) => {
            this.baseGetAllFromTableByFieldNameAndValue<{
                game_id: number,
                review_id: number,
                user_id: number,
            }>("review", "user_id", userId)
            .then(async result => {
                if(result.length === 0){
                    return resolve([]);
                }

                const reviews: ReviewModel[] = await Promise.all(
                    result.map(async row => {
                        const review = await (await this.baseGetById(row.review_id, DefaultReviewAdapterOptions));

                        return {
                            reviewId: row.review_id,
                            rating: review.rating,
                            comment: review.comment,
                            gameId: row.game_id,
                            userId: review.userId,
                            isAproved: review.isAproved,
                            isActive: review.isActive
                        }

                    })
                );

                resolve(reviews);
            })
            .catch(error => {
                reject(error);
            });
        });
    }
}

export default ReviewService;
export { DefaultReviewAdapterOptions, IReviewAdapterOptions };