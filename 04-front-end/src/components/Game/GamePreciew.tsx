import { Link } from "react-router-dom";
import { Config } from "../../config";
import IGame from "../../models/IGame.model";

export interface IGamePreviewProperties{
    game: IGame;
}

function GamePreview(props: IGamePreviewProperties){
    return(
        <div className="col-12 col-lg-6 p-3">
            <div className="card">
                <div className="card-body">
                    <div className="card-title">
                        <h2 className="h5">{props.game.title}</h2>
                    </div>
                    {
                        props.game.photos.length > 0
                        ? <img alt={ props.game.title }
                                src={ Config.API_PATH + "/assets/" + props.game.photos[0].filePath }
                                style={ { width: "150px" } } />
                        : <p>No image</p>
                    }
                    <div className="card-text d-grid gap-3">
                        <p>Description: <br /> {props.game.description}</p>
                        <p>Pegi: {props.game.pegi?.name} <br />
                            {props.game.pegi?.description}</p>
                        <hr />
                        <p>Categories: {props.game.categories?.map(c => 
                            <span className="d-inline-block px-2" key={"Category-"+c.categoryId+"-Game-"+props.game.gameId}>{c.name}</span>)}</p>
                        <hr />
                        <p>Platforms: {props.game.platforms?.map(c => 
                            <span className="d-inline-block px-2" key={"Platform-"+c.platformId+"-Game-"+props.game.gameId}>{c.name}</span>)}</p>
                        <hr />
                        <p>Publisher: {props.game.publisher} ({props.game.publishYear})</p>
                        <p>Price: {props.game.price}</p>
                        <Link className="btn btn-primary" to="/game/review/add">Add review</Link>
                    </div>
                </div>
            </div>
        </div>
        
    );
}

export default GamePreview;