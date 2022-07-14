import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api";
import IGame from "../../models/IGame.model";

interface IGameRowProperties {
    game: IGame;
}

export default function GameList() {
    const [ games, setGames ] = useState<IGame[]>([]);
    const [ errorMessage, setErrorMessage ] = useState<string>("");

    function loadGames() {
        api("get", "/api/game", "user")
        .then(res => {
            if (res.status === 'error') {
                return setErrorMessage(res.data + "");
            }

            setGames(res.data);
        });
    }

    useEffect(loadGames, [ ]);

    function GameRow(props: IGameRowProperties) {


        return (
            <>
            {props.game.isActive && 
                <tr>
                    <td>{ props.game.gameId }</td>
                    <td>{props.game.price}</td>
                    <td>
                        <div className="row">
                            <span className="col col-9">{ props.game.title }</span>
                        </div>
                    </td>
                    <td>
                        <div className="col col-4">
                            <div className="btn-group w-100">
                                <Link className="btn btn-primary" to={"/games/"+props.game.gameId}>See all</Link>
                                <Link className="btn btn-secondary" to={"/game/review/add"+props.game.gameId}>
                                    Add review
                                </Link>
                            </div>
                        </div>
                    </td>
                </tr>
            
            }
            </>
        );
    }

    return (
        <div>
            { errorMessage && <p className="alert aler-danger">{ errorMessage }</p> }
            { !errorMessage &&
            <>
                <table className="table table-sm table-hover game-list">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Price</th>
                            <th>Title</th>
                            <th>Options</th>
                        </tr>
                    </thead>
                    <tbody>
                        { games.map(game => <GameRow key={ "game" + game.gameId } game={ game } />) }
                    </tbody>
                </table>
            </>
            }
        </div>
    );
}