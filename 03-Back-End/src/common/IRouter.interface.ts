import * as express from 'express';
import IAppResource from './IAppResources.interface';

interface IRouter{
    setupRoutes(application: express.Application, resources: IAppResource);
}

export default IRouter;