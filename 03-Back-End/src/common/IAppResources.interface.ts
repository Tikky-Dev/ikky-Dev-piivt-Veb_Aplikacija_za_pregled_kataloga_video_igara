import * as mysql2 from "mysql2/promise";
import AdministratorService from "../components/admin/AdminService.service";
import CategoryService from '../components/category/CategoryService.service';
import GameService from '../components/game/GameService.service';
import PegiService from '../components/pegi/PegiService.service';
import PhotoService from "../components/photo/PhotoService.service";
import PlatformService from '../components/platform/PlatformService.service';
import UserService from '../components/user/UserService.service';
import ReviewService from '../components/review/ReviewService.service';

interface IAppResource{
    databaseConnection: mysql2.Connection;
    services: IServices;
}

interface IServices{
    category: CategoryService;
    game: GameService;
    pegi: PegiService;
    platform: PlatformService;
    photo: PhotoService;
    user: UserService;
    administrator: AdministratorService;
    review: ReviewService;
}

export default IAppResource;
export {IServices};