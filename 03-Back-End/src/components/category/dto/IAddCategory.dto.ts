
import Ajv from "ajv";
import IServiceData from "../../../common/IServiceData.interface";

const ajv = new Ajv();

interface IAddCategory extends IServiceData {
    category_name: string;
}

const AddCategoryValidator = ajv.compile({
    type: "object",
    properties: {
        category_name: {
            type: "string",
            minLength: 2,
            maxLength: 64,
        },
    },
    required: [
        "category_name",
    ],
    additionalProperties: false,
});

export default IAddCategory;
export { AddCategoryValidator };