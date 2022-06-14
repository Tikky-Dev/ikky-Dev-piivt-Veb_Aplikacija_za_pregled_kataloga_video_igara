
import Ajv from "ajv";
import IServiceData from "../../../common/IServiceData.interface";

const ajv = new Ajv();

interface IAddGame extends IServiceData {
    title: string;
    publisher: string;
    publish_year: number;
    description: string;
    price?: number;
    pegi_id: number;
}

const AddGameValidator = ajv.compile({
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
        publish_year:{
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
        pegi_id:{
            type: "number"
        }

    },
    required: [
        "title",
        "publisher",
        "publish_year",
        "description",
        "pegi_id"
    ],
    additionalProperties: false,
});

export default IAddGame;
export { AddGameValidator };