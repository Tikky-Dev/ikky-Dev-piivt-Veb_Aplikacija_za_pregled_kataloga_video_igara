import PlatformModel from "./PlatformModel.model";
import BaseService from '../../common/BaseService.service';
import IAdapterOptions from '../../common/IAdapterOptions.interface';
import IAddPlatform from './dto/IAddPlatform.dto';
import IEditPlatform from './dto/IEditPlatform.dto';

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
}

export default PlatformService;
export { DefaultPlatformAdapterOptions };