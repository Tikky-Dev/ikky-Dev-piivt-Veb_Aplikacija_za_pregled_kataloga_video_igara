import GameModel from '../game/GameModel.model';
class PegiModel{
    pegiId: number;
    name: string;
    description: string;
    isActive: boolean;

    games?: GameModel[];
}

export default PegiModel;