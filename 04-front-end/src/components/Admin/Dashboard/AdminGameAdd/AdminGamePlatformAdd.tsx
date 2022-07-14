import { faCheckSquare, faSquare } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useReducer, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api, { apiForm } from "../../../../api/api";
import IPlatform from "../../../../models/IPlatform.model";

export interface IAdminGamePlatformAddUrlParams extends Record<string, string | undefined> {
    id: string
}

interface IAddGameFormState {
    platforms: number[];
};

type TAddPlatform    = { type: "addGameForm/addPlatform",    value: number };
type TRemovePlatform = { type: "addGameForm/removePlatform", value: number };

type AddGameFormAction =
                       | TAddPlatform//
                       | TRemovePlatform//

function AddGameFormReducer(oldState: IAddGameFormState, action: AddGameFormAction): IAddGameFormState {
    switch (action.type) {

        case "addGameForm/addPlatform": {
            if (oldState.platforms.includes(action.value)) {
                return oldState;
            }

            return {
                ...oldState,
                // This changes:
                platforms: [ ...oldState.platforms, action.value ],
            }
        }

        case "addGameForm/removePlatform": {
            if (!oldState.platforms.includes(action.value)) {
                return oldState;
            }

            return {
                ...oldState,
                // This changes:
                platforms: [ ...oldState.platforms ].filter( ingredient => ingredient !== action.value ),
            }
        }


        default: return oldState;
    }
}

export default function AdminGamePlatformAdd() {
    const params = useParams<IAdminGamePlatformAddUrlParams>();

    const [ errorMessage, setErrorMessage ] = useState<string>("");
    const [ categories, setCategories ] = useState<IPlatform[]>();

    const navigate = useNavigate();

    const [ formState, dispatchFormStateAction ] = useReducer(AddGameFormReducer, {
        platforms: []
    });

    const loadCategories = () => {
        api("get", "/api/platform", "administrator")
        .then(res => {
            if (res.status !== "ok") {
                throw new Error("Could not load platform!");
            }

            return res.data;
        })
        .then(categories => {
            setCategories(categories);
        })
        .catch(error => {
            setErrorMessage(error?.message ?? "Unknown error!");
        });
    };

    const doAddGamePlatform = () => {

        formState.platforms.forEach(c => {
            api("post", "/api/game/"+ params.id + "/platform/" + c, "administrator", formState)
            .then(res => {
                if (res.status !== "ok") {
                    throw new Error("Could not add this game! Reason: " + res?.data?.map((error: any) => error?.instancePath + " " + error?.message).join(", "));
                }
    
                return res.data;
            })
            .catch(error => {
                setErrorMessage(error?.message ?? "Unknown error!");
            });
        });

        navigate("/admin/dashboard/game/" + params.id +"/platform/add", {
            replace: true,
        });
    };

    useEffect(() => {
        loadCategories();
    }, [ ]);

    return (
        <div>
            <div className="card">
                <div className="card-body">
                    <div className="card-title">
                        <h1 className="h5">Add platforms to game</h1>
                    </div>
                    <div className="card-text">
                        { errorMessage && <div className="alert alert-danger mb-3">{ errorMessage }</div> }

                       

                        <div className="form-froup mb-3">
                            <label>Categories</label>

                            { categories?.map(platform => (
                                <div key={ "platform-" + platform.platformId }>
                                    {
                                        formState.platforms.includes(platform.platformId)
                                        ? <FontAwesomeIcon onClick={ () => dispatchFormStateAction({ type: "addGameForm/removePlatform", value: platform.platformId }) } icon={ faCheckSquare } />
                                        : <FontAwesomeIcon onClick={ () => dispatchFormStateAction({ type: "addGameForm/addPlatform", value: platform.platformId }) } icon={ faSquare } />
                                    } { platform.name }
                                </div>
                            )) }
                        </div>


                        <div className="form-froup mb-3">
                            <button className="btn btn-primary" onClick={ () => doAddGamePlatform() }>
                                Add game
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}