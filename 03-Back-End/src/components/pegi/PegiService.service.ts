import BaseService from '../../common/BaseService.service';
import IAdapterOptions from '../../common/IAdapterOptions.interface';
import PegiModel from './PegiModel.model';

interface IPegiAdapterOptions extends IAdapterOptions{
    loadGames: boolean;
}

const DefaultPegiAdapterOptions: IPegiAdapterOptions = {
    loadGames: false,
}

class PegiService extends BaseService<PegiModel, IPegiAdapterOptions>{
    tableName(): string {
        return "pegi";
    }

    protected async adaptToModel(data: any, options: IPegiAdapterOptions = DefaultPegiAdapterOptions): Promise<PegiModel>{
        const pegi: PegiModel = new PegiModel();

        pegi.pegiId = Number(data?.pegi_id);
        pegi.name = data?.name;
        pegi.description = data?.description;
        pegi.isActive = data?.is_active === 1;

        if(options.loadGames){
            pegi.games = await this.services.game.getAllByPegiId(pegi.pegiId, {});
        }

        return pegi;
    }
}

export default PegiService;
export { DefaultPegiAdapterOptions };