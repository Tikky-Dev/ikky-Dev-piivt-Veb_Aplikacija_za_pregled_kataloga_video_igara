
import Ajv from "ajv";
import IServiceData from "../../../common/IServiceData.interface";

const ajv = new Ajv();

interface IAddReview extends IServiceData {
    rating: 1|2|3|4|5;
    comment: string;
    game_id: number;
    user_id: number;
}

const AddReviewValidator = ajv.compile({
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
        game_id: {
            type: "integer",
        },
        user_id: {
            type: "integer",
        },
    },
    required: [
        "rating",
        "comment",
        "game_id",
        "user_id",
    ],
    additionalProperties: false,
});

export default IAddReview;
export { AddReviewValidator };