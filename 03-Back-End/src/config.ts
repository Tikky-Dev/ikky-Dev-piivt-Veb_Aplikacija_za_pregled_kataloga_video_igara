import IConfig from './common/IConfig.interface';
import CategoryRouter from './components/category/CategoryRouter.router';
import PegiRouter from './components/pegi/PegiRouter.router';
import PlatformRouter from './components/platform/PlatformRouter.router';
import GameRouter from './components/game/GameRouter.router';

const DevConfig: IConfig = {
    server: {
        port:10000,
        static:{
            index: false,
            dotfiles: "deny",
            casheControl: true,
            etag: true,
            maxAge: 1000*60*60*24,
            route: "/assets",
            path: "./static"
        },
    },
    logger: {
        path: "./logs",
        logFormat: ":date[iso]\t:remote-addr\tmethod\t:status\tres[content-length] bytes\t:response-time ms",
        filename: "access.log"
    },
    database: {
        host: "localhost",
        port: 3306,
        user: "PIiVT_Aplikacija",
        password: "aplikacija",
        database: "PIiVT_APP",
        charset: "utf8",
        timezone: "+01:00",
        supportBigNumbers: true,
    },
    routers: [
        new CategoryRouter(),
        new PegiRouter(),
        new PlatformRouter(),
        new GameRouter(),
    ],
    fileUploads: {
        maxFiles: 5,
        maxFileSize: 5 * 1024 * 1024, // 5MB
        temporaryFileDirecotry: "../temp/",
        destinationDirectoryRoot: "uploads/",
        photos: {
            allowedTypes: [ "png", "jpg" ],
            allowedExtensions: [ ".png", ".jpg" ],
            width: {
                min: 320,
                max: 1920,
            },
            height: {
                min: 240,
                max: 1080,
            },
            resize: [
                {
                    prefix: "small-",
                    width: 320,
                    height: 240,
                    fit: "cover",
                    defaultBackground: { r: 0, g: 0, b: 0, alpha: 1, }
                },
                {
                    prefix: "medium-",
                    width: 640,
                    height: 480,
                    fit: "cover",
                    defaultBackground: { r: 0, g: 0, b: 0, alpha: 1, }
                },
            ],
        },
    },
}

export { DevConfig };