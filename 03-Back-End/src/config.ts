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
    ]
}

export { DevConfig };