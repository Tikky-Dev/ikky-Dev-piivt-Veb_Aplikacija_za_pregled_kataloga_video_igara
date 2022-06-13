
import Ajv from "ajv";
import IServiceData from "../../../common/IServiceData.interface";

const ajv = new Ajv();

interface IEditPlatform extends IServiceData {
    platform_name?: string;
    is_active?: number;
}
interface IEditPlatformDto {
    platformName?: string;
    isActive?: boolean;
}

const EditPlatformValidator = ajv.compile({
    type: "object",
    properties: {
        platformName: {
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

export default IEditPlatform;
export { EditPlatformValidator, IEditPlatformDto };