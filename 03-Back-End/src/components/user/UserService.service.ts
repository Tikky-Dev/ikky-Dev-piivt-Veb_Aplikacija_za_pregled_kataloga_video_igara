import BaseService from "../../common/BaseService.service";
import IAdapterOptions from "../../common/IAdapterOptions.interface";
import UserModel from "./UserModel.model";
import { IAddUser } from './dto/IAddUser.dto';
import { IEditUser } from "./dto/IEditUser.dto";



export interface IUserAdapterOptions extends IAdapterOptions {
    removePassword: boolean;
    removeActivationCode: boolean;
    loadReview: boolean;
}

export const DefaultUserAdapterOptions: IUserAdapterOptions = {
    removePassword: true,
    removeActivationCode: true,
    loadReview: false,
}

export default class UserService extends BaseService<UserModel, IUserAdapterOptions> {
    tableName(): string {
        return "user";
    }

    protected async adaptToModel(data: any, options: IUserAdapterOptions = DefaultUserAdapterOptions): Promise<UserModel> {
        const user = new UserModel();

        user.userId         = +data?.user_id;
        user.email          = data?.email;
        user.password   = data?.password_hash;
        user.name       = data?.name;
        user.surname        = data?.surename;
        user.address        = data?.address;
        user.place          = data?.place;
        user.isActive       = +data?.is_active === 1;
        user.activationCode = data?.activation_code ? data?.activation_code : null;
        user.passwordResetCode = data?.password_reset_code ? data?.password_reset_code : null;

        if (options.removePassword) {
            user.password = null;
        }

        if (options.removeActivationCode) {
            user.activationCode = null;
        }

        if (options.loadReview){
            user.reviews = await this.services.review.getAllByUserId(user.userId, DefaultUserAdapterOptions);
        }

        return user;
    }

    public async add(data: IAddUser, options: IUserAdapterOptions): Promise<UserModel> {
        return this.baseAdd(data, options);
    }

    public async edit(id: number, data: IEditUser, options: IUserAdapterOptions = { removePassword: true, removeActivationCode: true, loadReview: false}): Promise<UserModel> {
        return this.baseEditById(id, data, options);
    }

    public async getByEmail(email: string, option: IUserAdapterOptions = DefaultUserAdapterOptions): Promise<UserModel|null> {
        return new Promise((resolve, reject) => {
            this.baseGetAllByFealdNameAndValue("email", email, option)
            .then(result => {
                if (result.length === 0) {
                    return resolve(null);
                }

                resolve(result[0]);
            })
            .catch(error => {
                reject(error?.message);
            });
        });
    }

    public async getUserByPasswordResetCode(code: string, option: IUserAdapterOptions = DefaultUserAdapterOptions): Promise<UserModel|null> {
        return new Promise((resolve, reject) => {
            this.baseGetAllByFealdNameAndValue("password_reset_code", code, option)
            .then(result => {
                if (result.length === 0) {
                    return resolve(null);
                }

                resolve(result[0]);
            })
            .catch(error => {
                reject(error?.message);
            });
        });
    }

    public async getUserByActivateionCode(code: string, option: IUserAdapterOptions = DefaultUserAdapterOptions): Promise<UserModel|null> {
        return new Promise((resolve, reject) => {
            this.baseGetAllByFealdNameAndValue("activation_code", code, option)
            .then(result => {
                if (result.length === 0) {
                    return resolve(null);
                }

                resolve(result[0]);
            })
            .catch(error => {
                reject(error?.message);
            });
        });
    }
}