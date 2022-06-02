import IModel from '../../common/IModel.interface';
class CategoryModel implements IModel{
    categoryId: number;
    name: string;
    isActive: boolean;
}

export default CategoryModel;