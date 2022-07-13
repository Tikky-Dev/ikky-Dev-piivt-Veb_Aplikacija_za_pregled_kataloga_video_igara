import IGame from "./IGame.model";

interface ICategory{
    categoryId: number;
    name: string;
    isActive: boolean;

    games?: IGame[]
}

export default ICategory;