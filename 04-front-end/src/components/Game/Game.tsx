import { useEffect, useState } from "react";
import { Link, useParams } from 'react-router-dom';
import api from "../../api/api";
import { Config } from "../../config";
import IGame from "../../models/IGame.model";

interface IGamePageURLParams extends Record<string, string|undefined>{
    id: string;
}

function Game(){
    const [game, setGame] = useState<IGame>();
    const [ errorMessage, setErrorMessage ] = useState<string>("");

    const params = useParams();

    useEffect(() => {

        api("get", "/api/game/" + params.id, "user")
        .then(apiResponse => {
            if(apiResponse.status === "error"){
                throw { message: "Unknown error while loading platform", }
            }
            setGame(apiResponse.data)
        })
        .catch(err => {
            setErrorMessage(err?.message ?? "Unknown error while loading platform")
        })
    }, [])

    return(
        <div className="row">

            <div className="col-12 p-3">
                <div className="card">
                    <div className="card-body">
                        <div className="card-title">
                            <h2 className="h5">{game?.title}</h2>
                        </div>
                        {   game?.photos &&
                            game!.photos!.length > 0
                            ? <img alt={ game?.title }
                                    src={ Config.API_PATH + "/assets/" + game?.photos[0].filePath }
                                    style={ { width: "150px" } } />
                            : <p>No image</p>
                        }
                        <div className="card-text d-grid gap-3">
                            <p>Description: <br /> {game?.description}</p>
                            <p>Pegi: {game?.pegi?.name} <br />
                                {game?.pegi?.description}</p>
                            <hr />
                            <p>Categories: {game?.categories?.map(c => 
                                <span className="d-inline-block px-2" key={"Category-"+c.categoryId+"-Game-"+game?.gameId}>{c.name}</span>)}</p>
                            <hr />
                            <p>Platforms: {game?.platforms?.map(c => 
                                <span className="d-inline-block px-2" key={"Platform-"+c.platformId+"-Game-"+game?.gameId}>{c.name}</span>)}</p>
                            <hr />
                            <p>Publisher: {game?.publisher} ({game?.publishYear})</p>
                            <p>Price: {game?.price}</p>
                            <Link className="btn btn-primary" to="/game/review/add">Add review</Link>
                        </div>
                    </div>
                </div>
            </div>
        
        </div>
    );
}

export default Game;