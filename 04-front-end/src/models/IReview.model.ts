interface IReview{
    reviewId: number;
    rating: number;
    comment: string;
    gameId: number;
    userId: number;
    isAproved: boolean;
    isActiv: boolean; 
}

export default IReview;