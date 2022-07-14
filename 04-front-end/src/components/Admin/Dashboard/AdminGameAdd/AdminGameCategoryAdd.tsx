import { faCheckSquare, faSquare } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useReducer, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api, { apiForm } from "../../../../api/api";
import ICategory from "../../../../models/ICategory.model";
import IPegi from "../../../../models/IPegi.model";
import IPlatform from "../../../../models/IPlatform.model";

export interface IAdminGameCategoryAddUrlParams extends Record<string, string | undefined> {
    id: string
}

interface IAddGameFormState {
    categorys: number[];
};

type TAddCategory    = { type: "addGameForm/addCategory",    value: number };
type TRemoveCategory = { type: "addGameForm/removeCategory", value: number };

type AddGameFormAction =
                       | TAddCategory//
                       | TRemoveCategory//

function AddGameFormReducer(oldState: IAddGameFormState, action: AddGameFormAction): IAddGameFormState {
    switch (action.type) {

        case "addGameForm/addCategory": {
            if (oldState.categorys.includes(action.value)) {
                return oldState;
            }

            return {
                ...oldState,
                // This changes:
                categorys: [ ...oldState.categorys, action.value ],
            }
        }

        case "addGameForm/removeCategory": {
            if (!oldState.categorys.includes(action.value)) {
                return oldState;
            }

            return {
                ...oldState,
                // This changes:
                categorys: [ ...oldState.categorys ].filter( ingredient => ingredient !== action.value ),
            }
        }


        default: return oldState;
    }
}

export default function AdminGameCategoryAdd() {
    const params = useParams<IAdminGameCategoryAddUrlParams>();

    const [ errorMessage, setErrorMessage ] = useState<string>("");
    const [ categories, setCategories ] = useState<ICategory[]>();
    const [ platforms, setPlatforms ] = useState<IPlatform[]>();
    const [ pegis, setPegis ] = useState<IPegi[]>();
    const [ file, setFile ] = useState<File>();

    const navigate = useNavigate();

    const [ formState, dispatchFormStateAction ] = useReducer(AddGameFormReducer, {
        categorys: []
    });

    const loadCategories = () => {
        api("get", "/api/category", "administrator")
        .then(res => {
            if (res.status !== "ok") {
                throw new Error("Could not load category!");
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

    const doAddGameCategory = () => {

        formState.categorys.forEach(c => {
            api("post", "/api/game/"+ params.id + "/category/" + c, "administrator", formState)
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
                        <h1 className="h5">Add categories to game</h1>
                    </div>
                    <div className="card-text">
                        { errorMessage && <div className="alert alert-danger mb-3">{ errorMessage }</div> }

                       

                        <div className="form-froup mb-3">
                            <label>Categories</label>

                            { categories?.map(category => (
                                <div key={ "category-" + category.categoryId }>
                                    {
                                        formState.categorys.includes(category.categoryId)
                                        ? <FontAwesomeIcon onClick={ () => dispatchFormStateAction({ type: "addGameForm/removeCategory", value: category.categoryId }) } icon={ faCheckSquare } />
                                        : <FontAwesomeIcon onClick={ () => dispatchFormStateAction({ type: "addGameForm/addCategory", value: category.categoryId }) } icon={ faSquare } />
                                    } { category.name }
                                </div>
                            )) }
                        </div>


                        <div className="form-froup mb-3">
                            <button className="btn btn-primary" onClick={ () => doAddGameCategory() }>
                                Add game
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}