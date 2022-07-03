import Ajv from "ajv";
import addFormats from "ajv-formats";
import IServiceData from "../../../common/IServiceData.interface";

const ajv = new Ajv();
addFormats(ajv);

interface IAddUserDto {
    name: string;
    surename: string;
    address: string;
    place: string;
    email: string;
    phone: string;
    password: string;
}

interface IAddUser extends IServiceData {
    name: string;
    surename: string;
    address: string;
    place: string;
    email: string;
    phone: string;
    password_hash: string;
    activation_code: string;
}

const IAddUserValidator = ajv.compile({
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
        email: {
            type: "string",
            format: "email",
        },
        phone: {
            type: "string",
            pattern: "^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$",
        },
        password: {
            type: "string",
            pattern: "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{6,}$",
        },
    },
    required: [
        "name",
        "surename",
        "address",
        "place",
        "email",
        "phone",
        "password",
    ],
    additionalProperties: false,
});

export { IAddUserValidator, IAddUserDto, IAddUser };