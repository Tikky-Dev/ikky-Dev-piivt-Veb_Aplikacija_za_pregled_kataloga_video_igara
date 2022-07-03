import BaseService from '../../common/BaseService.service';
import IAdapterOptions from '../../common/IAdapterOptions.interface';
import PegiModel from './PegiModel.model';
import IAddPegi from './dto/IAddPegi.dto';
import IEditPegi from './dto/IEditPegi.dto';

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
            pegi.games = await this.services.game.getAllByPegiId(pegi.pegiId, {loadCategories: true, loadPlatforms: true, loadPhoto: true, loadReviews: false});
        }

        return pegi;
    }


    public async add(data: IAddPegi): Promise<PegiModel> {
        return this.baseAdd(data, DefaultPegiAdapterOptions);
    }

    public async edditById(pegiId: number, data: IEditPegi, options: IPegiAdapterOptions = DefaultPegiAdapterOptions): Promise<PegiModel>{
        return this.baseEditById(pegiId, data,options);
    }
}

export default PegiService;
export { DefaultPegiAdapterOptions };