import { faCheckSquare, faSquare } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useReducer, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api, { apiForm } from "../../../../api/api";
import IPegi from "../../../../models/IPegi.model";

export interface IAdminGameAddUrlParams extends Record<string, string | undefined> {
    id: string
}

interface IAddGameFormState {
    title: string;
    description: string;
    publisher: string;
    publish_year: number;
    pegi_id: number;

    price: number;
};

type TSetTitle          = { type: "addGameForm/setTitle",          value: string };
type TSetDescription   = { type: "addGameForm/setDescription",   value: string };
type TSetPublisher   = { type: "addGameForm/setPublisher",   value: string };
type TSetPublishYear    = { type: "addGameForm/setPublishYear",    value: number };
type TSetPegi    = { type: "addGameForm/setPegi",    value: number };
type TSetSizePrice     = { type: "addGameForm/setPrice",     value: number };

type AddGameFormAction = TSetTitle//
                       | TSetDescription//
                       | TSetPublisher//
                       | TSetPublishYear//
                       | TSetSizePrice//
                       | TSetPegi;

function AddGameFormReducer(oldState: IAddGameFormState, action: AddGameFormAction): IAddGameFormState {
    switch (action.type) {
        case "addGameForm/setTitle": {
            return {
                ...oldState,
                // This changes:
                title: action.value,
            }
        }

        case "addGameForm/setDescription": {
            return {
                ...oldState,
                // This changes:
                description: action.value,
            }
        }
        case "addGameForm/setPublisher": {
            return {
                ...oldState,
                // This changes:
                publisher: action.value,
            }
        }
        case "addGameForm/setPublishYear": {
            return {
                ...oldState,
                // This changes:
                publish_year: action.value,
            }
        }



        case "addGameForm/setPrice": {
            return {
                ...oldState,
                // This changes:
                price: action.value
            }
        }

        case "addGameForm/setPegi": {
            return {
                ...oldState,
                // This changes:
                pegi_id: action.value
            }
        }

        default: return oldState;
    }
}

export default function AdminGameAdd() {
    const params = useParams<IAdminGameAddUrlParams>();

    const [ errorMessage, setErrorMessage ] = useState<string>("");
    const [ pegis, setPegis ] = useState<IPegi[]>();
    const [ file, setFile ] = useState<File>();

    const navigate = useNavigate();

    const [ formState, dispatchFormStateAction ] = useReducer(AddGameFormReducer, {
        title: "",
        description: "",
        publisher: "",
        publish_year: 1950,
        pegi_id: 1,

        price: 0,
    });
    
    const loadPegi = () => {
        api("get", "/api/pegi", "administrator")
        .then(res => {
            if (res.status !== "ok") {
                throw new Error("Could not load this category!");
            }

            return res.data;
        })
        .then(category => {
            setPegis(category);
        })
        .catch(error => {
            setErrorMessage(error?.message ?? "Unknown error!");
        });
    };


    const doAddGame = () => {
        let gameId: string;
        api("post", "/api/game", "administrator", formState)
        .then(res => {
            if (res.status !== "ok") {
                throw new Error("Could not add this game! Reason: " + res?.data?.map((error: any) => error?.instancePath + " " + error?.message).join(", "));
            }

            return res.data;
        })
        .then(game => {
            if (!game?.gameId) {
                throw new Error("Could not fetch new game data!");
            }
            gameId = game.gameId;
            return game;
        })
        .then(game => {
            if (!file) {
                throw new Error("No game photo selected!");
            }

            return {
                file,
                game
            };
        })
        .then(({ file, game }) => {
            const data = new FormData();
            data.append("image", file);
            return apiForm("post", "/api/game/" + gameId + "/photo", "administrator", data)
        })
        .then(res => {
            if (res.status !== "ok") {
                throw new Error("Could not upload game photo!");
            }

            return res.data;
        })
        .then(() => {
            navigate("/admin/dashboard/game/"+ gameId +"/category/add", {
                replace: true,
            });
        })
        .catch(error => {
            setErrorMessage(error?.message ?? "Unknown error!");
        });
    };

    useEffect(() => {
        loadPegi();
    }, [ ]);

    return (
        <div>
            <div className="card">
                <div className="card-body">
                    <div className="card-title">
                        <h1 className="h5">Add new game</h1>
                    </div>
                    <div className="card-text">
                        { errorMessage && <div className="alert alert-danger mb-3">{ errorMessage }</div> }

                        <div className="form-group mb-3">
                            <label>Title</label>
                            <div className="input-group">
                                <input type="text" className="form-control form-control-sm"
                                    value={ formState.title }
                                    onChange={ e => dispatchFormStateAction({ type: "addGameForm/setTitle", value: e.target.value }) }
                                    />
                            </div>
                        </div>
                        <div className="form-group mb-3">
                            <label>Publisher</label>
                            <div className="input-group">
                                <input type="text" className="form-control form-control-sm"
                                    value={ formState.publisher }
                                    onChange={ e => dispatchFormStateAction({ type: "addGameForm/setPublisher", value: e.target.value }) }
                                    />
                            </div>
                        </div>
                        <div className="form-group mb-3">
                            <label>Publish year</label>
                            <div className="input-group">
                                <input type="text" className="form-control form-control-sm"
                                    value={ formState.publish_year }
                                    onChange={ e => dispatchFormStateAction({ type: "addGameForm/setPublishYear", value: +e.target.value }) }
                                    />
                            </div>
                        </div>
                        <div className="form-group mb-3">
                            <label>Price</label>
                            <div className="input-group">
                                <input type="text" className="form-control form-control-sm"
                                    value={ formState.price }
                                    onChange={ e => dispatchFormStateAction({ type: "addGameForm/setPrice", value: +e.target.value }) }
                                    />
                            </div>
                        </div>

                        <div className="form-group mb-3">
                            <label>Description</label>
                            <div className="input-group">
                                <textarea className="form-control form-control-sm" rows={ 5 }
                                    value={ formState.description }
                                    onChange={ e => dispatchFormStateAction({ type: "addGameForm/setDescription", value: e.target.value }) }
                                    />
                            </div>
                        </div>

                        <div className="form-froup mb-3">
                            <label>Pegi</label>


                            { pegis?.map(pegi => (

                                <div className="form-check" key={ "pegi_id-" + pegi.pegiId }>
                                <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" onClick={ () => dispatchFormStateAction({ type: "addGameForm/setPegi", value: pegi.pegiId })}/>
                                <label className="form-check-label" htmlFor="flexRadioDefault1">
                                { pegi.name }
                                </label>
                                </div>
                            )) }
                        </div>

                        <div className="form-froup mb-3">
                            <label>Game image</label>
                            <div className="input-group">
                                <input type="file" accept=".jpg,.png" className="from-control form-control-sm"
                                     onChange={ e => {
                                        if (e.target.files) {
                                            setFile(e.target.files[0])
                                        }
                                     } }
                                />
                            </div>
                        </div>

                        <div className="form-froup mb-3">
                            <button className="btn btn-primary" onClick={ () => doAddGame() }>
                                Add game
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}