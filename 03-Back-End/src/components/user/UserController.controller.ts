import { Request, Response } from "express";
import BaseController from "../../common/BaseController.controller";
import { IAddUserDto, IAddUserValidator } from "./dto/IAddUser.dto";
import * as bcrypt from "bcrypt";
import * as uuid from 'uuid';
import UserModel from "./UserModel.model";
import { IPasswordResetDto, PasswordResetValidator } from "./dto/IPasswordReset.dto";
import { DefaultUserAdapterOptions } from './UserService.service';
import { DevConfig } from "../../config";
import { IEditUser, IEditUserDto, IEditUserValidator } from "./dto/IEditUser.dto";
import * as generatePassword from "generate-password";
import * as nodemailer from "nodemailer";
import * as Mailer from "nodemailer/lib/mailer";
import IAddReview, { AddReviewValidator } from '../review/dto/IAddReview.dto';
import IEditReview, { EditReviewValidator, IEditReviewDto } from "../review/dto/IEditReview.dto";

export default class UserController extends BaseController {
    getAll(req: Request, res: Response) {
        this.service.user.baseGetAll(DefaultUserAdapterOptions)
        .then(result => {
            res.send(result);
        })
        .catch(error => {
            res.status(500).send(error?.message);
        });
    }

    getById(req: Request, res: Response) {
        const id: number = +req.params?.id;

        if (req.authorisation?.role === "user") {
            if (req.authorisation?.id !== id) {
                return res.status(403).send("You do not have access to this resource!");
            }
        }

        this.service.user.baseGetById(id, {
            removePassword: true,
            removeActivationCode: true,
            loadReview: true,
        })
        .then(result => {
            if (result === null) {
                res.status(404).send('User not found!');
            }
    
            res.send(result);
        })
        .catch(error => {
            res.status(500).send(error?.message);
        });
    }

    register(req: Request, res: Response) {
        const body = req.body as IAddUserDto;

        if (!IAddUserValidator(body)) {
            return res.status(400).send(IAddUserValidator.errors);
        }

        const passwordHash = bcrypt.hashSync(body.password, 10);

        this.service.user.startTransaction()
        .then(() => {
            return this.service.user.add({
                name: body.name,
                surename: body.surename,
                address: body.address,
                place: body.place,
                email: body.email,
                phone: body.phone,
                password_hash: passwordHash,
                activation_code: uuid.v4(),
            }, {removeActivationCode: false, removePassword: true, loadReview: false});
        })        
        .then(user => {
            return this.sendRegistrationEmail(user);
        })
        .then(async user => {
            await this.service.user.commitChanges();
            return user;
        })
        .then(user => {
            user.activationCode = null;
            res.send(user);
        })
        .catch(async error => {
            await this.service.user.rollbackChanges();
            res.status(500).send(error?.message);
        });
    }

    private async sendRegistrationEmail(user: UserModel): Promise<UserModel> {
        return new Promise((resolve, reject) => {
            const transport = this.getMailTransport();

            const mailOptions: Mailer.Options = {
                to: user.email,
                subject: "Account registration",
                html: `<!doctype html>
                        <html>
                            <head><meta charset="utf-8"></head>
                            <body>
                                <p>
                                    Dear ${ user.name } ${ user.surname },<br>
                                    Your account was successfully created.
                                </p>
                                <p>
                                    You must activate you account by clicking on the following link:
                                </p>
                                <p style="text-align: center; padding: 10px;">
                                    <a href="http://localhost:10000/api/user/activate/${user.activationCode}">Activate</a>
                                </p>
                            </body>
                        </html>`
            };
            
            transport.sendMail(mailOptions)
            .then(() => {
                transport.close();

                user.activationCode = null;

                resolve(user);
            })
            .catch(error => {
                transport.close();

                reject({
                    message: error?.message,
                });
            });
        });
    }

    passwordResetEmailSend(req: Request, res: Response) {
        const data = req.body as IPasswordResetDto;

        if (!PasswordResetValidator(data)) {
            return res.status(400).send(PasswordResetValidator.errors);
        }

        this.service.user.getByEmail(data.email, {
            removeActivationCode: false,
            removePassword: true,
            loadReview: false
        })
        .then(result => {
            if (result === null) {
                throw {
                    status: 404,
                    message: "User not found!",
                }
            }

            return result;
        })
        .then(user => {
            if (!user.isActive && !user.activationCode) {
                throw {
                    status: 403,
                    message: "Your account has been deactivated by the administrator!",
                }
            }

            return user;
        })
        .then(user => {
            const code = uuid.v4() + "-" + uuid.v4();

            return this.service.user.edit(
                user.userId,
                {
                    reset_code: code,
                },
                DefaultUserAdapterOptions,
            );
        })
        .then(user => {
            return this.sendRecoveryEmail(user);
        })
        .then(() => {
            res.send({
                message: "Sent"
            });
        })
        .catch(error => {
            setTimeout(() => {
                res.status(error?.status ?? 500).send(error?.message);
            }, 500);
        });
    }

    activate(req: Request, res: Response) {
        const code: string = req.params?.code;

        this.service.user.getUserByActivateionCode(code, DefaultUserAdapterOptions)
        .then(result => {
            if (result === null) {
                throw {
                    status: 404,
                    message: "User not found!",
                }
            }

            return result;
        })
        .then(result => {
            const user = result as UserModel;

            return this.service.user.edit(user.userId, {
                is_active: 1,
                activation_code: null,
            });
        })
        .then(user => {
            return this.sendActivationEmail(user);
        })
        .then(user => {
            res.send(user);
        })
        .catch(error => {
            setTimeout(() => {
                res.status(error?.status ?? 500).send(error?.message);
            }, 500);
        });
    }

    resetPassword(req: Request, res: Response) {
        const code: string = req.params?.code;

        this.service.user.getUserByPasswordResetCode(code, {
            removeActivationCode: false,
            removePassword: true,
            loadReview: false,
        })
        .then(result => {
            if (result === null) {
                throw {
                    status: 404,
                    message: "User not found!",
                }
            }

            return result;
        })
        .then(user => {
            if (!user.isActive && !user.activationCode) {
                throw {
                    status: 403,
                    message: "Your account has been deactivated by the administrator",
                };
            }

            return user;
        })
        .then(user => {
            const newPassword = generatePassword.generate({
                numbers: true,
                uppercase: true,
                lowercase: true,
                symbols: false,
                length: 18,
            });

            const passwordHash = bcrypt.hashSync(newPassword, 10);

            return new Promise<{user: UserModel, newPassword: string}>(resolve => {
                this.service.user.edit(
                    user.userId,
                    {
                        password_hash: passwordHash,
                        reset_code: null,
                    },
                    DefaultUserAdapterOptions
                )
                .then(user => {
                    return this.sendNewPassword(user, newPassword);
                })
                .then(user => {
                    resolve({
                        user: user,
                        newPassword: newPassword,
                    });
                })
                .catch(error => {
                    throw error;
                });
            });
        })
        .then(() => {
            res.send({
                message: 'Sent!',
            });
        })
        .catch(error => {
            setTimeout(() => {
                res.status(error?.status ?? 500).send(error?.message);
            }, 500);
        });
    }

    private getMailTransport() {
        return nodemailer.createTransport(
            {
                host: DevConfig.mail.host,
                port: DevConfig.mail.port,
                secure: false,
                tls: {
                    ciphers: "SSLv3",
                },
                debug: DevConfig.mail.debug,
                auth: {
                    user: DevConfig.mail.email,
                    pass: DevConfig.mail.password,
                },
            },
            {
                from: DevConfig.mail.email,
            },
        );
    }

    private async sendActivationEmail(user: UserModel): Promise<UserModel> {
        return new Promise((resolve, reject) => {
            const transport = this.getMailTransport();

            const mailOptions: Mailer.Options = {
                to: user.email,
                subject: "Account activation",
                html: `<!doctype html>
                        <html>
                            <head><meta charset="utf-8"></head>
                            <body>
                                <p>
                                    Dear ${ user.name } ${ user.surname },<br>
                                    Your account was successfully activated.
                                </p>
                                <p>
                                    You can now log into your account using the login form.
                                </p>
                            </body>
                        </html>`
            };

            transport.sendMail(mailOptions)
            .then(() => {
                transport.close();

                user.activationCode = null;
                user.passwordResetCode = null;

                resolve(user);
            })
            .catch(error => {
                transport.close();

                reject({
                    message: error?.message,
                });
            });
        });
    }

    private async sendNewPassword(user: UserModel, newPassword: string): Promise<UserModel> {
        return new Promise((resolve, reject) => {
            const transport = this.getMailTransport();

            const mailOptions: Mailer.Options = {
                to: user.email,
                subject: "New password",
                html: `<!doctype html>
                        <html>
                            <head><meta charset="utf-8"></head>
                            <body>
                                <p>
                                    Dear ${ user.name } ${ user.surname },<br>
                                    Your account password was successfully reset.
                                </p>
                                <p>
                                    Your new password is:<br>
                                    <pre style="padding: 20px; font-size: 24pt; color: #000; background-color: #eee; border: 1px solid #666;">${ newPassword }</pre>
                                </p>
                                <p>
                                    You can now log into your account using the login form.
                                </p>
                            </body>
                        </html>`
            };

            transport.sendMail(mailOptions)
            .then(() => {
                transport.close();

                user.activationCode = null;
                user.passwordResetCode = null;

                resolve(user);
            })
            .catch(error => {
                transport.close();

                reject({
                    message: error?.message,
                });
            });
        });
    }

    private async sendRecoveryEmail(user: UserModel): Promise<UserModel> {
        return new Promise((resolve, reject) => {
            const transport = this.getMailTransport();

            const mailOptions: Mailer.Options = {
                to: user.email,
                subject: "Account password reset code",
                html: `<!doctype html>
                        <html>
                            <head><meta charset="utf-8"></head>
                            <body>
                                <p>
                                    Dear ${ user.name } ${ user.surname },<br>
                                    Here is a link you can use to reset your account:
                                </p>
                                <p>
                                    <a href="http://localhost:10000/api/user/reset/${ user.passwordResetCode }"
                                        sryle="display: inline-block; padding: 10px 20px; color: #fff; background-color: #db0002; text-decoration: none;">
                                        Click here to reset your account
                                    </a>
                                </p>
                            </body>
                        </html>`
            };

            transport.sendMail(mailOptions)
            .then(() => {
                transport.close();

                user.activationCode = null;
                user.passwordResetCode = null;

                resolve(user);
            })
            .catch(error => {
                transport.close();

                reject({
                    message: error?.message,
                });
            });
        });
    }

    editById(req: Request, res: Response) {
        const id: number = +req.params?.aid;
        const data = req.body as IEditUserDto;

        if (req.authorisation?.role === "user") {
            if (req.authorisation?.id !== id) {
                return res.status(403).send("You do not have access to this resource!");
            }
        }

        if (!IEditUserValidator(data)) {
            return res.status(400).send(IEditUserValidator.errors);
        }

        const serviceData: IEditUser = { };

        if (data.password !== undefined) {
            const passwordHash = bcrypt.hashSync(data.password, 10);
            serviceData.password_hash = passwordHash;
        }

        if (DevConfig.auth.allowAllRoutesWithoutAuthTokens || req.authorisation?.role === "administrator") {
            if (data.isActive !== undefined) {
                serviceData.is_active = data.isActive ? 1 : 0;
            }
        }

        if (data.name !== undefined) {
            serviceData.name = data.name;
        }

        if (data.surename !== undefined) {
            serviceData.surename = data.surename;
        }

        if(data.address !== undefined){
            serviceData.address = data.address;
        }

        this.service.user.edit(id, serviceData)
        .then(result => {
            res.send(result);
        })
        .catch(error => {
            res.status(500).send(error?.message);
        });
    }


    addReview(req: Request, res: Response){
        const body = req.body as IAddReview;

        if (!AddReviewValidator(body)) {
            return res.status(400).send(AddReviewValidator.errors);
        }
        this.service.review.add(body)
        .then(result => {
            res.send(result);
        })
        .catch(error => {
            res.status(500).send(error?.message);
        });
    }

    editReviewById(req: Request, res: Response) {
        const id: number = +req.params?.rid;
        const data = req.body as IEditReviewDto;

        if (!EditReviewValidator(data)) {
            return res.status(400).send(EditReviewValidator.errors);
        }

        const serviceData: IEditReview = { };

        if(data.comment !== undefined){
            serviceData.comment = data.comment;
        }
        if (DevConfig.auth.allowAllRoutesWithoutAuthTokens || req.authorisation?.role === "user") {
            if(data.rating !== undefined){
                serviceData.rating = data.rating;
            }
        }
        if(data.isActive !== undefined){
            serviceData.is_active = data.isActive ? 1 : 0;
        }
        if (DevConfig.auth.allowAllRoutesWithoutAuthTokens || req.authorisation?.role === "administrator") {
            if(data.isApproved !== undefined){
                serviceData.is_approved = data.isApproved ? 1 : 0;
            }
        }
        

        this.service.review.edditById(id, serviceData)
        .then(result => {
            res.send(result);
        })
        .catch(error => {
            res.status(500).send(error?.message);
        });
    }
}