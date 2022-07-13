import IPegi from "./IPegi.model";
import ICategory from './ICategory.model';
import IPlatform from './IPlatform.model';
import IReview from './IReview.model';
import IPhoto from './IPhoto.model';

interface IGame{
    gameId: number;
    title: string;
    publisher: string;
    publishYear: number;
    description: string;
    price: number;
    isActive: boolean;
    
    pegi?: IPegi;
    categories?: ICategory[];
    platforms?: IPlatform[];
    reviews?: IReview[];
    photos: IPhoto[]



}

export default IGame;