import GameModel from "./GameModel.model";
import BaseService from '../../common/BaseService.service';
import IAdapterOptions from '../../common/IAdapterOptions.interface';
import IAddGame from './dto/IAddGame.dto';
import IEditGame from './dto/IEditGame.dto';

interface IGameAdapterOptions extends IAdapterOptions{

}

const DefaultGameAdapterOptions: IGameAdapterOptions = {

}

class GameService extends BaseService<GameModel, IGameAdapterOptions>{
    tableName(): string {
        return "game"
    }



    protected async adaptToModel(data: any): Promise<GameModel>{
        const game: GameModel = new GameModel();

        game.gameId = Number(data?.game_id);
        game.title = data?.title;
        game.publisher = data?.publisher;
        game.publishYear = Number(data?.publish_year);
        game.description = data?.description;
        game.price = Number(data?.price);
        game.pegiId = Number(data?.pegi_id);
        game.isActive = data?.is_active === 1;

        return game;
    }

    async getAllByPegiId(pegiId: number, options: IGameAdapterOptions): Promise<GameModel[]>{
        return this.baseGetAllByFealdNameAndValue('pegi_id', pegiId, options);
    }

    public async add(data: IAddGame): Promise<GameModel> {
        return this.baseAdd(data, DefaultGameAdapterOptions);
    }

    public async edditById(gameId: number, data: IEditGame, options: IGameAdapterOptions = DefaultGameAdapterOptions): Promise<GameModel>{
        return this.baseEditById(gameId, data,options);
    }

}

export default GameService;
export { DefaultGameAdapterOptions };