import GameService, { DefaultGameAdapterOptions } from './GameService.service';
import { Request, Response } from "express";
import BaseController from '../../common/BaseController.controller';
import IAddGame, { AddGameValidator } from './dto/IAddGame.dto';
import IEditGame, { EditGameValidator, IEditGameDto } from './dto/IEditGame.dto';
import { UploadedFile } from "express-fileupload";
import { mkdirSync, readFileSync, unlinkSync } from 'fs';
import filetype from "magic-bytes.js";
import { extname, basename } from "path";
import sizeOf from "image-size";
import * as uuid from "uuid";
import PhotoModel from '../photo/PhotoModel.model';
import IConfig, { IResize } from '../../common/IConfig.interface';
import { DevConfig } from '../../config';
import sharp = require('sharp');

class GameController extends BaseController{

    async getAll(req:Request, res: Response){
        this.service.game.baseGetAll(DefaultGameAdapterOptions)
            .then(result => {
                res.send(result);
            })
            .catch(error => {
                return res.status(500).send(error?.message);
            });
    }

    async getById(req:Request, res: Response){
        const id: number = Number(req.params?.id);
        this.service.game.baseGetById(id, {
                loadCategories: true,
                loadPlatforms: true,
                loadPhoto: true,
            })
            .then((result) => {
                if(result === null){
                   throw {
                       status: 404,
                       message: "Game not found!"
                   }
               }
               res.send(result);
            }).catch((error) => {
                res.status(error?.status ?? 500).send(error?.message);
            });
    }


    async add(req: Request, res: Response) {
        const data = req.body as IAddGame;

        if (!AddGameValidator(data)) {
            return res.status(400).send(AddGameValidator.errors);
        }

        this.service.game.add(data)
        .then(result => {
            res.send(result);
        })
        .catch(error => {
            res.status(400).send(error?.message);
        });
    }

    async edit(req: Request, res: Response) {
        const id: number = Number(req.params?.id);
        const data = req.body as IEditGameDto;

        if (!EditGameValidator(data)) {
            return res.status(400).send(EditGameValidator.errors);
        }


        this.service.game.baseGetById(id, DefaultGameAdapterOptions)
        .then(result => {
            if(result === null){
                throw {
                    status: 404,
                    message: "Game not found",
                }
            }
        })
        .then(() => {

            const serviceData: IEditGame = {};

            if(data.title !== undefined){
                serviceData.title = data.title
            }

            if(data.publisher !== undefined){
                serviceData.publisher = data.publisher
            }

            if(data.publishYear !== undefined){
                serviceData.publish_year = data.publishYear
            }
            
            if(data.description !== undefined){
                serviceData.title = data.description
            }

            if(data.price !== undefined){
                serviceData.price = data.price
            }


            if(data.pegiId !== undefined){
                serviceData.pegi_id = data.pegiId
            }

            if(data.isActive !== undefined){
                serviceData.is_active = data.isActive ? 1:0
            }

            return this.service.game.edditById(
                id,
                serviceData,
                DefaultGameAdapterOptions)
        })
        .then(result => {
            res.send(result);
        })
        .catch(error => {
            res.status(400).send(error?.message);
        });
    }


    async addCategoryToGame(req: Request, res:Response){
        const gameId: number = Number(req.params?.gid);
        const categoryId: number = Number(req.params?.cid);

        this.service.game.addNewCategoryToTheGame(gameId, categoryId)
        .then(result => {
            res.status(200).send(result);
        })
        .catch(error => {
            res.status(400).send(error?.message);
        });
    }

    async deleteCategoryFromGame(req: Request, res:Response){
        const gameId: number = Number(req.params?.gid);
        const categoryId: number = Number(req.params?.pid);

        this.service.game.deleteCategoryFromTheGame(gameId, categoryId)
        .then(result => {
            res.status(200).send(result);
        })
        .catch(error => {
            res.status(400).send(error?.message);
        });
    }


    async addPlatformToGame(req: Request, res:Response){
        const gameId: number = Number(req.params?.gid);
        const platformId: number = Number(req.params?.pid);

        this.service.game.addNewPlatformToTheGame(gameId, platformId)
        .then(result => {
            res.status(200).send(result);
        })
        .catch(error => {
            res.status(400).send(error?.message);
        });
    }

    async deletePlatformFromGame(req: Request, res:Response){
        const gameId: number = Number(req.params?.gid);
        const platformId: number = Number(req.params?.pid);

        this.service.game.deletePlatformFromTheGame(gameId, platformId)
        .then(result => {
            res.status(200).send(result);
        })
        .catch(error => {
            res.status(400).send(error?.message);
        });
    }


    async uploadPhoto(req: Request, res: Response) {
        const gameId: number = +req.params?.gid;

        this.service.game.baseGetById(gameId, DefaultGameAdapterOptions)
        .then(result => {
            if (result === null) throw {
                code: 400,
                message: "Game not found!",
            };

            return result;
        })
        .then(result => {
            return this.doFileUpload(req);
        })
        .then(async uploadedFiles => {
            const photos: PhotoModel[] = [];

            for (let singleFile of await uploadedFiles) {
                const filename = basename(singleFile);

                const photo = await this.service.photo.add({
                    name: filename,
                    file_path: singleFile,
                    game_id: gameId,
                });

                if (photo === null) {
                    throw {
                        code: 500,
                        message: "Failed to add this photo into the database!",
                    };
                }

                photos.push(photo);
            }

            res.send(photos);
        })
        .catch(error => {
            res.status(error?.code).send(error?.message);
        });
    }

    private async doFileUpload(req: Request): Promise<string[] | null> {
        const config: IConfig = DevConfig;

        if (!req.files || Object.keys(req.files).length === 0) {
            throw {
                code: 400,
                message: "No file were uploaded!",
            }
        };

        const fileFieldNames = Object.keys(req.files);

        const now = new Date();
        const year = now.getFullYear();
        const month = ((now.getMonth() + 1) + "").padStart(2, "0");

        const uploadDestinationRoot = config.server.static.path + "/";
        const destinationDirectory  = config.fileUploads.destinationDirectoryRoot + year + "/" + month + "/";

        mkdirSync(uploadDestinationRoot + destinationDirectory, {
            recursive: true,
            mode: "777",
        });

        const uploadedFiles = [];

        for (let fileFieldName of fileFieldNames) {
            const file = req.files[fileFieldName] as UploadedFile;

            const type = filetype(readFileSync(file.tempFilePath))[0]?.typename;

            if (!config.fileUploads.photos.allowedTypes.includes(type)) {
                unlinkSync(file.tempFilePath);
                throw {
                    code: 415,
                    message: `File ${fileFieldName} - type is not supported!`,
                };
            }


            file.name = file.name.toLocaleLowerCase();

            const declaredExtension = extname(file.name);

            if (!config.fileUploads.photos.allowedExtensions.includes(declaredExtension)) {
                unlinkSync(file.tempFilePath);
                throw {
                    code: 415,
                    message: `File ${fileFieldName} - extension is not supported!`,
                };
            }

            const size = sizeOf(file.tempFilePath);

            if ( size.width < config.fileUploads.photos.width.min || size.width > config.fileUploads.photos.width.max ) {
                unlinkSync(file.tempFilePath);
                throw {
                    code: 415,
                    message: `File ${fileFieldName} - image width is not supported!`,
                };
            }

            if ( size.height < config.fileUploads.photos.height.min || size.height > config.fileUploads.photos.height.max ) {
                unlinkSync(file.tempFilePath);
                throw {
                    code: 415,
                    message: `File ${fileFieldName} - image height is not supported!`,
                };
            }

            const fileNameRandomPart = uuid.v4();

            const fileDestinationPath = uploadDestinationRoot + destinationDirectory + fileNameRandomPart + "-" + file.name;

            file.mv(fileDestinationPath, async error => {
                if (error) {
                    throw {
                        code: 500,
                        message: `File ${fileFieldName} - could not be saved on the server!`,
                    };
                }

                for (let resizeOptions of config.fileUploads.photos.resize) {
                    await this.createResizedPhotos(destinationDirectory, fileNameRandomPart + "-" + file.name, resizeOptions);
                }
            });

            uploadedFiles.push(destinationDirectory + fileNameRandomPart + "-" + file.name);
        }

        return uploadedFiles;
    }

    private async createResizedPhotos(directory: string, filename: string, resizeOptions: IResize) {
        const config: IConfig = DevConfig;

        await sharp(config.server.static.path + "/" + directory + filename)
        .resize({
            width: resizeOptions.width,
            height: resizeOptions.height,
            fit: resizeOptions.fit,
            background: resizeOptions.defaultBackground,
            withoutEnlargement: true,
        })
        .toFile(config.server.static.path + "/" + directory + resizeOptions.prefix + filename);
    }


}

export default GameController;