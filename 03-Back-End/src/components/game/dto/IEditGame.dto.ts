
import Ajv from "ajv";
import IServiceData from "../../../common/IServiceData.interface";

const ajv = new Ajv();

interface IEditGame extends IServiceData {
    title?: string;
    publisher?: string;
    publish_year?: number;
    description?: string;
    price?: number;
    pegi_id?: number;
    is_active?: number;
}
interface IEditGameDto {
    title?: string;
    publisher?: string;
    publishYear?: number;
    description?: string;
    price?: number;
    pegiId?: number;
    isActive?: boolean;
}

const EditGameValidator = ajv.compile({
    type: "object",
    properties: {
        title: {
            type: "string",
            minLength: 2,
            maxLength: 64,
        },
        publisher:{
            type: "string",
            minLength: 2,
            maxLength: 128,
        },
        publishYear:{
            type: "integer",
            minimum: 1950,
        },
        description:{
            type: "string",
            minLength: 10,
            maxLength: 500,
        },
        price:{
            type: "number",
            multipleOf: 0.01,
            minimum: 0.01,
        },
        pegiId:{
            type: "number"
        },
        isActive:{
            type: "boolean"
        }
    },
    required: [
        
    ],
    additionalProperties: false,
});


export default IEditGame;
export { EditGameValidator, IEditGameDto };