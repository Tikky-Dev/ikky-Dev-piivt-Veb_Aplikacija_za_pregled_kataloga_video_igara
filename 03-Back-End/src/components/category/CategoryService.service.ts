import CategoryModel from "./CategoryModel.model";
import BaseService from '../../common/BaseService.service';
import IAdapterOptions from '../../common/IAdapterOptions.interface';
import IAddCategory from "./dto/IAddCategory.dto";

interface ICategoryAdapterOptions extends IAdapterOptions{

}

const DefaultCategoryAdapterOptions: ICategoryAdapterOptions = {

}

class CategoryService extends BaseService<CategoryModel, ICategoryAdapterOptions>{
    tableName(): string {
        return "category"
    }



    protected async adaptToModel(data: any): Promise<CategoryModel>{
        const category: CategoryModel = new CategoryModel();

        category.categoryId = Number(data?.category_id);
        category.name = data?.category_name;
        category.isActive = data?.is_active === 1;

        return category;
    }


    public async add(data: IAddCategory): Promise<CategoryModel> {
        return this.baseAdd(data, DefaultCategoryAdapterOptions);
    }
}

export default CategoryService;
export { DefaultCategoryAdapterOptions };