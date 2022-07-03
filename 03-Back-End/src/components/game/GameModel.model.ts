import CategoryModel from '../category/CategoryModel.model';
import PlatformModel from '../platform/PlatformModel.model';
import PhotoModel from '../photo/PhotoModel.model';
import ReviewModel from '../review/ReviewModel.model';

class GameModel{
    gameId: number;
    title: string;
    publisher: string;
    publishYear: number;
    description: string;
    price: number;
    pegiId: number;
    isActive: boolean;

    categories?: CategoryModel[];
    platforms?: PlatformModel[];
    photo?: PhotoModel[];
    reviews?: ReviewModel[];
}

export default GameModel;