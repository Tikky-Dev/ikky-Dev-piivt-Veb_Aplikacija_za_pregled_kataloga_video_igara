import * as express from "express";
import * as cors from "cors";
import IConfig from './common/IConfig.interface';
import { DevConfig } from "./config";
import * as fs from "fs";
import * as morgan from "morgan";
import IAppResource from "./common/IAppResources.interface";
import * as mysql2 from 'mysql2/promise';
import CategoryService from './components/category/CategoryService.service';
import GameService from './components/game/GameService.service';
import PegiService from './components/pegi/PegiService.service';
import PlatformService from './components/platform/PlatformService.service';
import PhotoService from './components/photo/PhotoService.service';
import fileUpload = require("express-fileupload")

async function main(){
    const app: express.Application = express();

    const config: IConfig = DevConfig;

    const db = await mysql2.createConnection({
        host: config.database.host,
        port: config.database.port,
        user: config.database.user,
        password: config.database.password,
        database: config.database.database,
        charset: config.database.charset,
        timezone: config.database.timezone,
        supportBigNumbers: config.database.supportBigNumbers,
    });

    const appResources: IAppResource = {
        databaseConnection: db,
        services: {
            category: null,
            game: null,
            pegi: null,
            platform: null,
            photo: null,
        }
    };

    appResources.services.category = new CategoryService(appResources);
    appResources.services.game = new GameService(appResources);
    appResources.services.pegi = new PegiService(appResources);
    appResources.services.platform = new PlatformService(appResources);
    appResources.services.photo = new PhotoService(appResources);
    

    fs.mkdirSync(config.logger.path, {
        mode: 0o755,
        recursive: true,
    });
    app.use(morgan(config.logger.logFormat, {
        stream: fs.createWriteStream(config.logger.path + "/" + config.logger.filename, {
            flags: 'a'
        })
    }));
    
    app.use(cors());
    app.use(express.urlencoded({extended: true,}));
    app.use(fileUpload({
        limits: {
            files: 5,
            fileSize: 1024 * 1024 * 5,
        },
        abortOnLimit: true,
        useTempFiles: true,
        tempFileDir: "../temp/",
        createParentPath: true,
        safeFileNames: true,
        preserveExtension: true,
    }));
    app.use(express.json());
    app.use(config.server.static.route, express.static(config.server.static.path, {
        index: config.server.static.index,
        dotfiles: config.server.static.dotfiles,
        cacheControl: config.server.static.casheControl,
        etag: config.server.static.etag,
    }));
    



    for(const router of config.routers){
        router.setupRoutes(app, appResources);
    };



    // Default response
    app.use((req, res) => {
        res.sendStatus(404);
    });

    app.listen(config.server.port);
}

process.on("uncaughtException", error =>{
    console.error("Error: ", error);
});

main();