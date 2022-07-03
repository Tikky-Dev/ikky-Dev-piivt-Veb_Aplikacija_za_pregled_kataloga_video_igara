import IModel from '../../common/IModel.interface';

class ReviewModel implements IModel{
    reviewId: number;
    rating: number;
    comment: string;
    gameId?: number;
    userId?: number;
    isAproved?: boolean;
    isActive?: boolean;
}

export default ReviewModel;