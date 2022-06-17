import GameModel from "./GameModel.model";
import BaseService from '../../common/BaseService.service';
import IAdapterOptions from '../../common/IAdapterOptions.interface';
import IAddGame from './dto/IAddGame.dto';
import IEditGame from './dto/IEditGame.dto';
import { ICategoryAdapterOptions } from "../category/CategoryService.service";
import { IPlatformAdapterOptions } from "../platform/PlatformService.service";

interface IGameAdapterOptions extends IAdapterOptions{
    loadCategories: boolean;
    loadPlatforms: boolean;
}

const DefaultGameAdapterOptions: IGameAdapterOptions = {
    loadCategories: false,
    loadPlatforms: false,
}

class GameService extends BaseService<GameModel, IGameAdapterOptions>{
    tableName(): string {
        return "game"
    }



    protected async adaptToModel(data: any, options: IGameAdapterOptions): Promise<GameModel>{
        const game: GameModel = new GameModel();

        game.gameId = Number(data?.game_id);
        game.title = data?.title;
        game.publisher = data?.publisher;
        game.publishYear = Number(data?.publish_year);
        game.description = data?.description;
        game.price = Number(data?.price);
        game.pegiId = Number(data?.pegi_id);
        game.isActive = data?.is_active === 1;

        if(options.loadCategories){
            game.categories = await this.services.category.getAllByGameId(game.gameId, DefaultGameAdapterOptions);
        }

        if(options.loadCategories){
            game.platforms = await this.services.platform.getAllByGameId(game.gameId, DefaultGameAdapterOptions);
        }

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

    public async getAllByCategoryId(categoryId: number, options: ICategoryAdapterOptions): Promise<GameModel[]>{
        return new Promise((resolve, reject) => {
            this.baseGetAllFromTableByFieldNameAndValue<{
                game_category_id: number,
                game_id: number,
                category_id: number,
            }>("game_category", "category_id", categoryId)
            .then(async result => {
                if(result.length === 0){
                    return resolve([]);
                }

                const games: GameModel[] = await Promise.all(
                    result.map(async row => {
                        const game = await (await this.baseGetById(row.game_id, DefaultGameAdapterOptions));

                        return {
                            gameId: row.category_id,
                            name: game.title,
                            title: game.title,
                            publisher: game.publisher,
                            publishYear: game.publishYear,
                            description: game.description,
                            price: game.price,
                            pegiId: game.pegiId,
                            isActive: game.isActive,
                        }

                    })
                );

                resolve(games);
            })
            .catch(error => {
                reject(error);
            });
        });
    }

    public async getAllByPlatformId(platformId: number, options: IPlatformAdapterOptions): Promise<GameModel[]>{
        return new Promise((resolve, reject) => {
            this.baseGetAllFromTableByFieldNameAndValue<{
                game_category_id: number,
                game_id: number,
                platform_id: number,
            }>("game_platform", "platform_id", platformId)
            .then(async result => {
                if(result.length === 0){
                    return resolve([]);
                }

                const games: GameModel[] = await Promise.all(
                    result.map(async row => {
                        const game = await (await this.baseGetById(row.game_id, DefaultGameAdapterOptions));

                        return {
                            gameId: row.platform_id,
                            name: game.title,
                            title: game.title,
                            publisher: game.publisher,
                            publishYear: game.publishYear,
                            description: game.description,
                            price: game.price,
                            pegiId: game.pegiId,
                            isActive: game.isActive,
                        }

                    })
                );

                resolve(games);
            })
            .catch(error => {
                reject(error);
            });
        });
    }

}

export default GameService;
export { DefaultGameAdapterOptions, IGameAdapterOptions };