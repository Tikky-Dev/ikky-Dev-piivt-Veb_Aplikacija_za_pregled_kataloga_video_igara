import { Request, Response } from "express";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import ITokenData from "./dto/ITokenData";
import { IUserLoginDto } from "./dto/IUserLogin.dto";
import BaseController from "../../common/BaseController.controller";
import { IAdministratorLoginDto } from "./dto/IAdministratorlogin.dto";
import { DevConfig } from "../../config";
import AuthMiddleware from "../../middlewares/AuthMiddleware";

export default class AuthController extends BaseController {
    public async administratorLogin(req: Request, res: Response) {
        const data = req.body as IAdministratorLoginDto;

        this.service.administrator.getByUsername(data.username)
        .then(result => {
            if (result === null) {
                throw {
                    status: 404,
                    message: "Administrator account not found!"
                };
            }

            return result;
        })
        .then(administrator => {
            if (!bcrypt.compareSync(data.password, administrator.passwordHash)) {
                throw {
                    status: 404,
                    message: "Administrator account not found!"
                };
            }

            return administrator;
        })
        .then(administrator => {
            const tokenData: ITokenData = {
                role: "administrator",
                id: administrator.administratorId,
                identity: administrator.username,
            };

            const authToken = jwt.sign(tokenData, DevConfig.auth.administrator.tokens.auth.keys.private, {
                algorithm: DevConfig.auth.administrator.algorithm,
                issuer: DevConfig.auth.administrator.issuer,
                expiresIn: DevConfig.auth.administrator.tokens.auth.duration,
            });

            const refreshToken = jwt.sign(tokenData, DevConfig.auth.administrator.tokens.refresh.keys.private, {
                algorithm: DevConfig.auth.administrator.algorithm,
                issuer: DevConfig.auth.administrator.issuer,
                expiresIn: DevConfig.auth.administrator.tokens.refresh.duration,
            });

            res.send({
                authToken: authToken,
                refreshToken: refreshToken,
                id: administrator.administratorId,
            });
        })
        .catch(error => {
            setTimeout(() => {
                res.status(error?.status ?? 500).send(error?.message);
            }, 1500);
        });
    }

    administratorRefresh(req: Request, res: Response) {
        const refreshTokenHeader: string = req.headers?.authorization ?? "";

        try {
            const tokenData = AuthMiddleware.validateTokenAs(refreshTokenHeader, "administrator", "refresh");
    
            const authToken = jwt.sign(tokenData, DevConfig.auth.administrator.tokens.auth.keys.private, {
                algorithm: DevConfig.auth.administrator.algorithm,
                issuer: DevConfig.auth.administrator.issuer,
                expiresIn: DevConfig.auth.administrator.tokens.auth.duration,
            });
    
            res.send({
                authToken: authToken,
            });
        } catch (error) {
            res.status(error?.status ?? 500).send(error?.message);
        }
    }

    public async userLogin(req: Request, res: Response) {
        const data = req.body as IUserLoginDto;

        this.service.user.getByEmail(data.email, {loadReview: false, removeActivationCode: true, removePassword: false})
        .then(result => {
            if (result === null) {
                throw {
                    status: 404,
                    message: "User account not found!"
                };
            }

            return result;
        })
        .then(user => {
            if (!bcrypt.compareSync(data.password, user.password)) {
                throw {
                    status: 404,
                    message: "User account not found!"
                };
            }

            return user;
        })
        .then(user => {
            if (!user.isActive) {
                throw {
                    status: 404,
                    message: "User account is not active!"
                };
            }

            return user;
        })
        .then(user => {
            const tokenData: ITokenData = {
                role: "user",
                id: user.userId,
                identity: user.name + " " + user.surname,
            };

            const authToken = jwt.sign(tokenData, DevConfig.auth.user.tokens.auth.keys.private, {
                algorithm: DevConfig.auth.user.algorithm,
                issuer: DevConfig.auth.user.issuer,
                expiresIn: DevConfig.auth.user.tokens.auth.duration,
            });

            const refreshToken = jwt.sign(tokenData, DevConfig.auth.user.tokens.refresh.keys.private, {
                algorithm: DevConfig.auth.user.algorithm,
                issuer: DevConfig.auth.user.issuer,
                expiresIn: DevConfig.auth.user.tokens.refresh.duration,
            });

            res.send({
                authToken: authToken,
                refreshToken: refreshToken,
                id: user.userId,
            });
        })
        .catch(error => {
            setTimeout(() => {
                res.status(error?.status ?? 500).send(error?.message);
            }, 1500);
        });
    }

    userRefresh(req: Request, res: Response) {
        const refreshTokenHeader: string = req.headers?.authorization ?? ""; // "Bearer TOKEN"

        try {
            const tokenData = AuthMiddleware.validateTokenAs(refreshTokenHeader, "user", "refresh");
    
            const authToken = jwt.sign(tokenData, DevConfig.auth.user.tokens.auth.keys.private, {
                algorithm: DevConfig.auth.user.algorithm,
                issuer: DevConfig.auth.user.issuer,
                expiresIn: DevConfig.auth.user.tokens.auth.duration,
            });
    
            res.send({
                authToken: authToken,
            });
        } catch (error) {
            res.status(error?.status ?? 500).send(error?.message);
        }
    }
}