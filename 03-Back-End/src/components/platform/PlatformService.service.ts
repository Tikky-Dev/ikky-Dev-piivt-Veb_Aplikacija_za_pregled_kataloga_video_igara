import PlatformModel from "./PlatformModel.model";
import BaseService from '../../common/BaseService.service';
import IAdapterOptions from '../../common/IAdapterOptions.interface';
import IAddPlatform from './dto/IAddPlatform.dto';
import IEditPlatform from './dto/IEditPlatform.dto';
import { IGameAdapterOptions } from "../game/GameService.service";

interface IPlatformAdapterOptions extends IAdapterOptions{

}

const DefaultPlatformAdapterOptions: IPlatformAdapterOptions = {

}

class PlatformService extends BaseService<PlatformModel, IPlatformAdapterOptions>{
    tableName(): string {
        return "platform"
    }



    protected async adaptToModel(data: any): Promise<PlatformModel>{
        const platform: PlatformModel = new PlatformModel();

        platform.platformId = Number(data?.platform_id);
        platform.name = data?.platform_name;
        platform.isActive = data?.is_active === 1;

        return platform;
    }

    public async add(data: IAddPlatform): Promise<PlatformModel>{
        return this.baseAdd(data, DefaultPlatformAdapterOptions);
    }

    public async editById(platformId: number, data: IEditPlatform, options: IPlatformAdapterOptions = DefaultPlatformAdapterOptions): Promise<PlatformModel>{
        return this.baseEditById(platformId, data, options);
    }

    public async getAllByGameId(gameId: number, options: IGameAdapterOptions): Promise<PlatformModel[]>{
        return new Promise((resolve, reject) => {
            this.baseGetAllFromTableByFieldNameAndValue<{
                game_platform_id: number,
                game_id: number,
                platform_id: number,
            }>("game_platform", "game_id", gameId)
            .then(async result => {
                if(result.length === 0){
                    return resolve([]);
                }

                const platforms: PlatformModel[] = await Promise.all(
                    result.map(async row => {
                        const platform = await (await this.baseGetById(row.platform_id, {}));

                        return {
                            platformId: row.platform_id,
                            name: platform.name,
                            isActive: platform.isActive
                        }

                    })
                );

                resolve(platforms);
            })
            .catch(error => {
                reject(error);
            });
        });
    }
}

export default PlatformService;
export { DefaultPlatformAdapterOptions };