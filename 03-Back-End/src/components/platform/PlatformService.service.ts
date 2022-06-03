import PlatformModel from "./PlatformModel.model";
import BaseService from '../../common/BaseService.service';
import IAdapterOptions from '../../common/IAdapterOptions.interface';

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
}

export default PlatformService;
export { DefaultPlatformAdapterOptions };