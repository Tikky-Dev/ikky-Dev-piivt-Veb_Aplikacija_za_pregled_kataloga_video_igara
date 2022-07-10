import CategoryModel from '../category/CategoryModel.model';
import PlatformModel from '../platform/PlatformModel.model';
import PhotoModel from '../photo/PhotoModel.model';
import ReviewModel from '../review/ReviewModel.model';
import PegiModel from '../pegi/PegiModel.model';

class GameModel{
    gameId: number;
    title: string;
    publisher: string;
    publishYear: number;
    description: string;
    price: number;
    pegi: PegiModel;
    isActive: boolean;

    categories?: CategoryModel[];
    platforms?: PlatformModel[];
    photo?: PhotoModel[];
    reviews?: ReviewModel[];
}

export default GameModel;