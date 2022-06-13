
import Ajv from "ajv";
import IServiceData from "../../../common/IServiceData.interface";

const ajv = new Ajv();

interface IAddPlatform extends IServiceData {
    platform_name: string;
}

const AddPlatformValidator = ajv.compile({
    type: "object",
    properties: {
        platform_name: {
            type: "string",
            minLength: 2,
            maxLength: 64,
        },
    },
    required: [
        "platform_name",
    ],
    additionalProperties: false,
});

export default IAddPlatform;
export { AddPlatformValidator };