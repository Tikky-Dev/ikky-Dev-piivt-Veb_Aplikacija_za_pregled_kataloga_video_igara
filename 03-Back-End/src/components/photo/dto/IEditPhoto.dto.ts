import IServiceData from "../../../common/IServiceData.interface";

interface IEditPhoto extends IServiceData {
    is_active?: number;
}
interface IEditPhotoDto {
    isActive?: boolean;
}

const EditPhotoValidator = {
    type: "object",
    properties: {
        isActive:{
            type: "boolean"
        }
    },
    required: [
        
    ],
    additionalProperties: false,
};

export default IEditPhoto;
export { IEditPhotoDto, EditPhotoValidator }