import IRouter from './IRouter.interface';
interface IConfig{
    server: {
        port: number,
        static: {
            index: string|false,
            dotfiles: "allow"|"deny",
            casheControl: boolean,
            etag: boolean,
            maxAge: number,
            route: string,
            path: string
        },
    },
    logger: {
        path: string,
        logFormat: string,
        filename: string
    },
    database: {
        host: string,
        port: number,
        user: string,
        password: string,
        database: string,
        charset: "utf8"| "utf8mb4" | "ascii",
        timezone: string,
        supportBigNumbers: boolean,
    },
    routers: IRouter[],
}

export default IConfig;