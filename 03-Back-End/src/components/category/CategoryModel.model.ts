import IModel from '../../common/IModel.interface';
import GameModel from '../game/GameModel.model';
class CategoryModel implements IModel{
    categoryId: number;
    name: string;
    isActive: boolean;

    games?: GameModel[]; 
}

export default CategoryModel;