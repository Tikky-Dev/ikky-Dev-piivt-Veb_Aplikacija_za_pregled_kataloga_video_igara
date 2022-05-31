import CategoryModel from "./CategoryModel.model";
import * as mysql2 from 'mysql2/promise';

class CategoryService{
    private db: mysql2.Connection;

    constructor(databaseConnection: mysql2.Connection){
        this.db = databaseConnection;
    }

    private async adaptToModel(data: any): Promise<CategoryModel>{
        const category: CategoryModel = new CategoryModel();

        category.categoryId = Number(data?.category_id);
        category.name = data?.category_name;

        return category;
    }

    public async getAll(): Promise<CategoryModel[]>{
        return new Promise<CategoryModel[]>((resolve, reject) => {
            const sql: string = "SELECT * FROM `category` WHERE `is_active` = 1 ORDER BY `category_name` ;";
            // typeorm --> pogledati!!
            this.db.execute(sql)
                .then(async ([ rows ]) => {
                    if(rows === undefined){
                        return resolve([]);
                    }
                    const categories: CategoryModel[] = [];
                    
                    for(const row of rows as mysql2.RowDataPacket[]){
                        categories.push(await this.adaptToModel(row));
                    }

                    resolve(categories);
                })
                .catch(error => {
                    reject(error);
                });
        });
        
    }

    public async getById(categoryId: number): Promise<CategoryModel|null>{
        if(categoryId === 8){
            return null;
        }
        
        return {
            categoryId: categoryId,
            name: "CAtegory " + categoryId + "name"
        }
    }
}

export default CategoryService;