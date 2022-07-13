import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ICategory from '../../../models/ICategory.model';
import IGame from '../../../models/IGame.model';
import GamePreview from '../../Game/GamePreciew';

interface ICategoryPageURLParams extends Record<string, string|undefined>{
    id: string;
}

function CatgoryPage(){
    const [category, setCategory] = useState<ICategory|null>(null);
    const [games, setGames] = useState<IGame[]>([]);
    const [ errorMessage, setErrorMessage ] = useState<string>("");
    const [ loading, setLoading ] = useState<boolean>(false);

    const params = useParams<ICategoryPageURLParams>();

    useEffect(() => {
        setLoading(true);

        fetch("http://localhost:10000/api/category/"+params.id)
        .then(res => res.json())
        .then(data => {
            setCategory(data);
            setGames(data.games)
        })
        .catch(error => {
            setErrorMessage(error?.message ?? "Unknown error while loading category")
        })
        .finally(() => {
            setLoading(false);
        })
    }, [])
    
    return(
        <div>
            {loading && <p>Loading...</p>}
            {errorMessage && <p>Error: {errorMessage}</p>}

            {category && (
                <div>
                    <h1>{category?.name}</h1>

                    {games && (
                        <div>
                            {games.map(g => <GamePreview key={"category-" + category.categoryId +"-game-"+g.gameId} game={g} />)}
                        </div>
                    )}

                    {games.length === 0 && (
                        <p>There are no games currently in this category</p>
                    )}
                    
                </div>
            )}
            
        </div>
    );
}

export default CatgoryPage;
export type {ICategoryPageURLParams}