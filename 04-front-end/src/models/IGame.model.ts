import IPegi from "./IPegi.model";
import ICategory from './ICategory.model';
import IPlatform from './IPlatform.model';
import IReview from './IReview.model';

interface IGame{
    gameId: number;
    title: string;
    publisher: string;
    publishYeard: number;
    description: string;
    price: number;
    isActive: boolean;
    
    pegi?: IPegi;
    categories?: ICategory[];
    platforms?: IPlatform[];
    reviews?: IReview[];



}

export default IGame;