import BaseService from '../../common/BaseService.service';
import IAdapterOptions from '../../common/IAdapterOptions.interface';
import PegiModel from './PegiModel.model';

interface IPegiAdapterOptions extends IAdapterOptions{

}

const DefaultPegiAdapterOptions: IPegiAdapterOptions = {

}

class PegiService extends BaseService<PegiModel, IPegiAdapterOptions>{
    tableName(): string {
        return "pegi";
    }



    protected async adaptToModel(data: any): Promise<PegiModel>{
        const pegi: PegiModel = new PegiModel();

        pegi.pegiId = Number(data?.pegi_id);
        pegi.name = data?.name;
        pegi.description = data?.description;
        pegi.isActive = data?.is_active === 1;

        return pegi;
    }
}

export default PegiService;
export { DefaultPegiAdapterOptions };