import { IServices } from "./IAppResources.interface";

abstract class BaseController{
    private serviceInstance: IServices;

    constructor(service: IServices){
        this.serviceInstance = service;
    }

    protected get service(): IServices{
        return this.serviceInstance;
    }
}

export default BaseController;