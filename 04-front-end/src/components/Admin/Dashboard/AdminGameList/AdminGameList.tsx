import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquare, faSquareCheck } from "@fortawesome/free-regular-svg-icons";
import api from "../../../../api/api";
import IGame from "../../../../models/IGame.model";
import { Link } from "react-router-dom";

interface IAdminGameRowProperties {
    game: IGame;
}

export default function AdminGameList() {
    const [ games, setGames ] = useState<IGame[]>([]);
    const [ errorMessage, setErrorMessage ] = useState<string>("");

    function loadGames() {
        api("get", "/api/game", "administrator")
        .then(res => {
            if (res.status === 'error') {
                return setErrorMessage(res.data + "");
            }

            setGames(res.data);
        });
    }

    useEffect(loadGames, [ ]);

    function AdminGameRow(props: IAdminGameRowProperties) {

        const activeSideClass   = props.game.isActive ? " btn-primary" : " btn-light";
        const inactiveSideClass = !props.game.isActive ? " btn-primary" : " btn-light";

        function doToggleGameActiveState() {
            api("put", "/api/game/" + props.game.gameId, "administrator", {
                isActive: !props.game.isActive,
            })
            .then(res => {
                if (res.status === 'error') {
                    return setErrorMessage(res.data + "");
                }

                loadGames();
            });
        }

        return (
            <>
                <tr>
                    <td>{ props.game.gameId }</td>
                    <td>{props.game.price}</td>
                    <td>
                        
                        <div className="row">
                            <span className="col col-9">{ props.game.title }</span>
                            <div className="col col-3">
                                <div className="btn-group w-100">
                                    <Link className="btn btn-primary" to={"/admin/dashboard/game/"+props.game.gameId}>See all</Link>
                                    <Link className="btn btn-secondary" to={"/admin/dashboard/game/"+props.game.gameId+"/edit"}>
                                        Edit
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </td>
                    <td>
                        <div className="btn-group" onClick={() => { doToggleGameActiveState() }}>
                            <div className={"btn btn-sm" + activeSideClass}>
                                <FontAwesomeIcon icon={ faSquareCheck } />
                            </div>
                            <div className={"btn btn-sm" + inactiveSideClass}>
                                <FontAwesomeIcon icon={ faSquare } />
                            </div>
                        </div>
                    </td>
                </tr>
            
            </>
        );
    }

    return (
        <div>
            { errorMessage && <p className="alert aler-danger">{ errorMessage }</p> }
            { !errorMessage &&
            <>
                <Link className="btn btn-primary btn-sm" to="/admin/dashboard/game/add" >Add new game</Link>


                <table className="table table-sm table-hover game-list">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Price</th>
                            <th>Title</th>
                            <th>Status (Active)</th>
                        </tr>
                    </thead>
                    <tbody>
                        { games.map(game => <AdminGameRow key={ "game" + game.gameId } game={ game } />) }
                    </tbody>
                </table>
            </>
            }
        </div>
    );
}