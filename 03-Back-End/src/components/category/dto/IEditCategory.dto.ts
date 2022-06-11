
import Ajv from "ajv";
import IServiceData from "../../../common/IServiceData.interface";

const ajv = new Ajv();

interface IEditCategory extends IServiceData {
    category_name?: string;
    is_active?: number;
}
interface IEditCategoryDto {
    categoryName?: string;
    isActive?: boolean;
}

const EditCategoryValidator = ajv.compile({
    type: "object",
    properties: {
        categoryName: {
            type: "string",
            minLength: 2,
            maxLength: 64,
        },
        isActive:{
            type: "boolean"
        }
    },
    required: [
        
    ],
    additionalProperties: false,
});

export default IEditCategory;
export { EditCategoryValidator, IEditCategoryDto };