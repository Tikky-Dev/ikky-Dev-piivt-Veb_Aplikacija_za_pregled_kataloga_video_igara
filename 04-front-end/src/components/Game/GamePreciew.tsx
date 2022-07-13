import IGame from "../../models/IGame.model";

export interface IGamePreviewProperties{
    game: IGame;
}

function GamePreview(props: IGamePreviewProperties){
    return(
        <div>
            <h2>{props.game.title}</h2>
            <p>{props.game.description}</p>
            <p>Categries:</p>
            <ul>
                {props.game.categories?.map(c => 
                    <span className="d-inline-block px-2" key={"Category-"+c.categoryId+"-Game-"+props.game.gameId}>{c.name}</span>)}
            </ul>
            <p>Pegi: </p>
            <p>{props.game.pegi?.name}: <br /> {props.game.pegi?.description}</p>

            <h5>Price: {Number(props.game.price).toFixed(2)} EUR</h5>
            
        </div>
    );
}

export default GamePreview;