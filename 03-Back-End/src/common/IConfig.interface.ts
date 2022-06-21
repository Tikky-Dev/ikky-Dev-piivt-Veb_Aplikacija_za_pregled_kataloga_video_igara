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
    fileUploads: {
        maxFiles: number,
        maxFileSize: number,
        temporaryFileDirecotry: string,
        destinationDirectoryRoot: string,
        photos: {
            allowedTypes: string[],
            allowedExtensions: string[],
            width: {
                min: number,
                max: number,
            },
            height: {
                min: number,
                max: number,
            },
            resize: IResize[],
        },
    }
}
interface IResize {
    prefix: string,
    width: number,
    height: number,
    fit: "contain" | "cover",
    defaultBackground: {
        r: number,
        g: number,
        b: number,
        alpha: number,
    },
}

interface IMailConfiguration {
    host: string,
    port: number,
    email: string,
    password: string,
    debug: boolean,
}

export default IConfig;
export { IMailConfiguration, IResize };