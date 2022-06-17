import IModel from '../../common/IModel.interface';
import GameModel from '../game/GameModel.model';
class PlatformModel implements IModel{
    platformId: number;
    name: string;
    isActive: boolean;

    games?: GameModel[];
}

export default PlatformModel;