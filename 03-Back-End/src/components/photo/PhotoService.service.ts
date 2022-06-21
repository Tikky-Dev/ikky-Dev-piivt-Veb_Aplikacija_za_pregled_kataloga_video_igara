import BaseService from "../../common/BaseService.service";
import IAdapterOptions from "../../common/IAdapterOptions.interface";
import IAddPhoto from "./dto/IAddPhoto.dto";
import PhotoModel from "./PhotoModel.model";

interface IPhotoAdapterOptions extends IAdapterOptions {

}

class PhotoService extends BaseService<PhotoModel, IPhotoAdapterOptions> {
    tableName(): string {
        return "photo";
    }

    protected adaptToModel(data: any, options: IPhotoAdapterOptions): Promise<PhotoModel> {
        return new Promise(resolve => {
            const photo = new PhotoModel();

            photo.photoId  = +data?.photo_id;
            photo.name     = data?.name;
            photo.filePath = data?.file_path;
            photo.isActive = Number(data?.is_active) === 1

            resolve(photo);
        })
    }

    public async add(data: IAddPhoto, options: IPhotoAdapterOptions = {}): Promise<PhotoModel> {
        return this.baseAdd(data, options);
    }

    public async getAllByGameId(gameId: number, options: IPhotoAdapterOptions = {}): Promise<PhotoModel[]> {
        return this.baseGetAllByFealdNameAndValue("game_id", gameId, options);
    }
}

export default PhotoService;
export {IPhotoAdapterOptions};