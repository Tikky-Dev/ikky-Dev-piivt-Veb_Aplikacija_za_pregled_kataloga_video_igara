import * as express from "express";
import * as cors from "cors";
import IConfig from './common/IConfig.interface';
import { DevConfig } from "./config";
import * as fs from "fs";
import * as morgan from "morgan";
import IAppResource from "./common/IAppResources.interface";
import * as mysql2 from 'mysql2/promise';

async function main(){
    const app: express.Application = express();

    

    const config: IConfig = DevConfig;
    const appResources: IAppResource = {
        databaseConnection: await mysql2.createConnection({
            host: config.database.host,
            port: config.database.port,
            user: config.database.user,
            password: config.database.password,
            database: config.database.database,
            charset: config.database.charset,
            timezone: config.database.timezone,
            supportBigNumbers: config.database.supportBigNumbers,
        }),
    };

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

main();