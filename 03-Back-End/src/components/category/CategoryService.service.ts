import CategoryModel from "./CategoryModel.model";
import BaseService from '../../common/BaseService.service';
import IAdapterOptions from '../../common/IAdapterOptions.interface';
import IAddCategory from "./dto/IAddCategory.dto";
import IEditCategory from './dto/IEditCategory.dto';
import { IGameAdapterOptions } from "../game/GameService.service";

interface ICategoryAdapterOptions extends IAdapterOptions{
    loadGames: boolean;
}

const DefaultCategoryAdapterOptions: ICategoryAdapterOptions = {
    loadGames:false,
}

class CategoryService extends BaseService<CategoryModel, ICategoryAdapterOptions>{
    tableName(): string {
        return "category"
    }



    protected async adaptToModel(data: any, options: ICategoryAdapterOptions): Promise<CategoryModel>{
        const category: CategoryModel = new CategoryModel();

        category.categoryId = Number(data?.category_id);
        category.name = data?.category_name;
        category.isActive = data?.is_active === 1;

        if(options.loadGames){
            category.games = await this.services.game.getAllByCategoryId(category.categoryId, DefaultCategoryAdapterOptions);
        }

        return category;
    }


    public async add(data: IAddCategory): Promise<CategoryModel> {
        return this.baseAdd(data, DefaultCategoryAdapterOptions);
    }

    public async edditById(categoryId: number, data: IEditCategory, options: ICategoryAdapterOptions = DefaultCategoryAdapterOptions): Promise<CategoryModel>{
        return this.baseEditById(categoryId, data,options);
    }

    public async getAllByGameId(gameId: number, options: IGameAdapterOptions): Promise<CategoryModel[]>{
        return new Promise((resolve, reject) => {
            this.baseGetAllFromTableByFieldNameAndValue<{
                game_category_id: number,
                game_id: number,
                category_id: number,
            }>("game_category", "game_id", gameId)
            .then(async result => {
                if(result.length === 0){
                    return resolve([]);
                }

                const categories: CategoryModel[] = await Promise.all(
                    result.map(async row => {
                        const category = await (await this.baseGetById(row.category_id, DefaultCategoryAdapterOptions));

                        return {
                            categoryId: row.category_id,
                            name: category.name,
                            isActive: category.isActive
                        }

                    })
                );

                resolve(categories);
            })
            .catch(error => {
                reject(error);
            });
        });
    }
}

export default CategoryService;
export { DefaultCategoryAdapterOptions, ICategoryAdapterOptions };