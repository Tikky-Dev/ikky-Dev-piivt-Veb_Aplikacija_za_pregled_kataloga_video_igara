import * as mysql2 from "mysql2/promise";
import CategoryService from '../components/category/CategoryService.service';
import GameService from '../components/game/GameService.service';
import PegiService from '../components/pegi/PegiService.service';
import PlatformService from '../components/platform/PlatformService.service';

interface IAppResource{
    databaseConnection: mysql2.Connection;
    services: IServices;
}

interface IServices{
    category: CategoryService;
    game: GameService;
    pegi: PegiService;
    platform: PlatformService;

}

export default IAppResource;
export {IServices};