
import Ajv from "ajv";
import IServiceData from "../../../common/IServiceData.interface";

const ajv = new Ajv();

interface IEditPegi extends IServiceData {
    name?: string;
    description?: string;
    is_active?: number;
}
interface IEditPegiDto {
    pegiName?: string;
    pegiDescription?: string;
    isActive?: boolean;
}

const EditPegiValidator = ajv.compile({
    type: "object",
    properties: {
        pegiName: {
            type: "string",
            minLength: 2,
            maxLength: 64,
        },
        pegiDescription: {
            type: "string",
            minLength: 2,
            maxLength: 500,
        },
        isActive:{
            type: "boolean"
        }
    },
    required: [
        
    ],
    additionalProperties: false,
});

export default IEditPegi;
export { EditPegiValidator, IEditPegiDto };