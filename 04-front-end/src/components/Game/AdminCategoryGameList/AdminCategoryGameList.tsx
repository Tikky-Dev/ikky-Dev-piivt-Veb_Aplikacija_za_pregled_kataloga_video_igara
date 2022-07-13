import { faSquare, faSquareCheck } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../../api/api";
import ICategory from "../../../models/ICategory.model";
import IGame from "../../../models/IGame.model";

export interface IAdminCategoryGameListUrlParams extends Record<string, string | undefined> {
    id: string
}

interface IAdminGameListRowProperties {
    game: IGame;
}

export default function AdminCategoryGameList() {
    const params = useParams<IAdminCategoryGameListUrlParams>();

    const [ category, setCategory ] = useState<ICategory>();
    const [ errorMessage, setErrorMessage ] = useState<string>("");
    const [ showAddNewGame, setShowAddNewGame ] = useState<boolean>(false);

    useEffect(() => {
        loadCategoryData(+(params.id ?? 0));
    }, [ params.id ]);

    function loadCategoryData(categoryId: number) {
        if (!categoryId) {
            return;
        }

        api("get", "/api/category/" + categoryId, "administrator")
        .then(res => {
            if (res.status === 'error') {
                return setErrorMessage(res.data + "");
            }

            setCategory(res.data);

            setShowAddNewGame(false);
        });
    }

    function doToggleAdministratorActiveState(game: IGame) {
        api("put", "/api/game/" + game.gameId, "administrator", {
            isActive: !game.isActive,
        })
        .then(res => {
            if (res.status === 'error') {
                return setErrorMessage(res.data + "");
            }

            loadCategoryData(Number(params.id));
        });
    }

    function AdminGameListRow(props: IAdminGameListRowProperties) {
        const [ name, setName ] = useState<string>(props.game.title);

        const activeSideClass   = props.game.isActive ? " btn-primary" : " btn-light";
        const inactiveSideClass = !props.game.isActive ? " btn-primary" : " btn-light";

        const nameChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
            setName( e.target.value );
        }

        const doEditGame = (e: any) => {
            api("put", "/api/category/" + category?.categoryId + "/game/" + props.game.gameId, "administrator", { name })
            .then(res => {
                if (res.status === 'error') {
                    return setErrorMessage("Could not edit this game!");
                }

                loadCategoryData(+(params.id ?? 0));
            })
        }

        return (
            <tr>
                <td>{ props.game.gameId }</td>
                <td>{props.game.title}</td>
                <td>{props.game.price}</td>
                <td>
                    <div className="btn-group" onClick={() => { doToggleAdministratorActiveState(props.game) }}>
                        <div className={"btn btn-sm" + activeSideClass}>
                            <FontAwesomeIcon icon={ faSquareCheck } />
                        </div>
                        <div className={"btn btn-sm" + inactiveSideClass}>
                            <FontAwesomeIcon icon={ faSquare } />
                        </div>
                    </div>
                </td>
                <td>
                     <Link className="btn btn-primary btn-sm" to={ "/admin/dashboard/game/" + props.game.gameId + "/edit" }>
                        Edit Game
                    </Link>
                </td>
            </tr>
        );
    }

    function renderGameTable(category: ICategory) {
        return (
            <div>
                <div className="btn-group">
                    <Link className="btn btn-secondary btn-sm" to="/admin/dashboard/categories">
                        &laquo; Back to category &quot;{ category.name }&quot;
                    </Link>
                    <Link className="btn btn-primary btn-sm" to="/admin/dashboard/game/add">
                        Add new game
                    </Link>
                </div>

                <table className="table table-sm table-hover">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Price</th>
                            <th>Active</th>
                            <th>Options</th>
                        </tr>
                    </thead>
                    <tbody>
                        { category.games?.map(game => <AdminGameListRow key={ "game-" + game.gameId } game={ game } />) }
                    </tbody>
                </table>
            </div>
        );
    }

    return (
        <div>
            { errorMessage && <p className="alert alert-danger mb-3">{ errorMessage }</p> }
            { category && renderGameTable(category) }
        </div>
    );
}