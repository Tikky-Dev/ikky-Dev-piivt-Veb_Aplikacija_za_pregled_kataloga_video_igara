import Ajv from "ajv";
import addFormats from "ajv-formats";
import IServiceData from "../../../common/IServiceData.interface";

const ajv = new Ajv();
addFormats(ajv);

interface IEditUserDto {
    name?: string;
    surename?: string;
    address?: string;
    place?: string;
    phone?: string;
    password?: string;
    isActive: boolean;
}

interface IEditUser extends IServiceData {
    name?: string;
    surename?: string;
    address?: string;
    place?: string;
    phone?: string;
    password_hash?: string;
    activation_code?: string;
    reset_code?: string;
    is_active?: number;
}

const IEditUserValidator = ajv.compile({
    type: "object",
    properties: {
        name: {
            type: "string",
            minLength: 2,
            maxLength: 64,
        },
        surename: {
            type: "string",
            minLength: 2,
            maxLength: 64,
        },
        address:{
            type: "string",
            minLength: 10,
            maxLength: 255,
        },
        place: {
            type: "string",
            minLength: 2,
            maxLength: 64,
        },
        phone: {
            type: "string",
            pattern: "^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$",
        },
        password: {
            type: "string",
            pattern: "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{6,}$",
        },
        isActive: {
            type: "boolean"
        }
    },
    required: [

    ],
    additionalProperties: false,
});

export { IEditUserValidator, IEditUserDto, IEditUser };