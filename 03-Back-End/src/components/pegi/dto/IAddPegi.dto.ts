
import Ajv from "ajv";
import IServiceData from "../../../common/IServiceData.interface";

const ajv = new Ajv();

interface IAddPegi extends IServiceData {
    name: string;
    description: string;
}

const AddPegiValidator = ajv.compile({
    type: "object",
    properties: {
        name: {
            type: "string",
            minLength: 2,
            maxLength: 64,
        },
        description: {
            type: "string",
            minLength: 10,
            maxLength: 500,
        }
    },
    required: [
        "name",
        "description"
    ],
    additionalProperties: false,
});

export default IAddPegi;
export { AddPegiValidator };