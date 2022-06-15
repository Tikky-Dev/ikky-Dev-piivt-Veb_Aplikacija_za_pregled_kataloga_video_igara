import CategoryModel from '../category/CategoryModel.model';

class GameModel{
    gameId: number;
    title: string;
    publisher: string;
    publishYear: number;
    description: string;
    price: number;
    pegiId: number;
    isActive: boolean;

    categories: CategoryModel[];
}

export default GameModel;