import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../../api/api';
import IPlatform from '../../../models/IPlatform.model';
import IGame from '../../../models/IGame.model';
import GamePreview from '../../Game/GamePreciew';

interface IPlatformPageURLParams extends Record<string, string|undefined>{
    id: string;
}

function CatgoryPage(){
    const [platform, setPlatform] = useState<IPlatform|null>(null);
    const [games, setGames] = useState<IGame[]>([]);
    const [ errorMessage, setErrorMessage ] = useState<string>("");
    const [ loading, setLoading ] = useState<boolean>(false);

    const params = useParams<IPlatformPageURLParams>();

    useEffect(() => {
        setLoading(true);

        api("get", "/api/platform/" + params.id, "user")
        .then(apiResponse => {
            if(apiResponse.status === "error"){
                throw { message: "Unknown error while loading platform", }
            }
            
            setPlatform(apiResponse.data);
            setGames(apiResponse.data.games)
        })
        .catch(err => {
            setErrorMessage(err?.message ?? "Unknown error while loading platform")
        })
        .finally(() => {
                setLoading(false);
            }
        )
    }, [])
    
    return(
        <div>
            {loading && <p>Loading...</p>}
            {errorMessage && <p>Error: {errorMessage}</p>}

            {platform && (
                <div>
                    <h1>{platform?.name}</h1>

                    {games && (
                        <div className='row'>
                            {games.map(g => <GamePreview key={"platform-" + platform.platformId +"-game-"+g.gameId} game={g} />)}
                        </div>
                    )}

                    {games.length === 0 && (
                        <p>There are no games currently in this platform</p>
                    )}
                    
                </div>
            )}
            
        </div>
    );
}

export default CatgoryPage;
export type {IPlatformPageURLParams}