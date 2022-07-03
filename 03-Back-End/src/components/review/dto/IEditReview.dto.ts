
import Ajv from "ajv";
import IServiceData from "../../../common/IServiceData.interface";

const ajv = new Ajv();

interface IEditReview extends IServiceData {
    rating?: 1|2|3|4|5;
    comment?: string;
    is_approved?: number;
    is_active?: number;
}
interface IEditReviewDto {
    rating?: 1|2|3|4|5;
    comment?: string;
    isApproved?: boolean;
    isActive?: boolean;
}

const EditReviewValidator = ajv.compile({
    type: "object",
    properties: {
        rating: {
            type: "integer",
        },
        comment: {
            type: "string",
            minLength: 32,
            maxLength: 500,
        },
        isApproved:{
            type: "boolean"
        },
        isActive:{
            type: "boolean"
        }
    },
    required: [
    ],
    additionalProperties: false,
});

export default IEditReview;
export { EditReviewValidator, IEditReviewDto };