import CategoryModel from '../category/CategoryModel.model';
import PlatformModel from '../platform/PlatformModel.model';

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
}

export default GameModel;