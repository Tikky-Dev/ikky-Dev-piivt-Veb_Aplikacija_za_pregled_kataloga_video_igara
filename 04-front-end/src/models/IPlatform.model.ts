import IGame from './IGame.model';
interface IPlatform{
    platformId: number;
    name: string;
    isActive: boolean;
    games: IGame[];
}

export default IPlatform;