import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../../api/api";
import ICategory from "../../../../models/ICategory.model";
import './AdminCategoryList.sass';

interface IAdminCategoryListRowProperties {
    category: ICategory,
}

export default function AdminCategoryList() {
    const [ categories, setCategories ] = useState<ICategory[]>([]);
    const [ errorMessage, setErrorMessage ] = useState<string>("");
    const [ showAddNewCategory, setShowAddNewCategory ] = useState<boolean>(false);

    function AdminCategoryListRow(props: IAdminCategoryListRowProperties) {
        const [ categoryName, setName ] = useState<string>(props.category.name);

        const nameChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
            setName( e.target.value );
        }

        const doEditCategory = (e: any) => {
            api("put", "/api/category/" + props.category.categoryId, "administrator", { categoryName })
            .then(res => {
                if (res.status === 'error') {
                    return setErrorMessage("Could not edit this category!");
                }

                loadCategories();
            })
        }

        return (
            <tr>
                <td>{ props.category.categoryId }</td>
                <td>
                    <div className="input-group">
                        <input className="form-control form-control-sm"
                               type="text"
                               onChange={ e => nameChanged(e) }
                               value={ categoryName } />
                        { props.category.name !== categoryName
                            ? <button className="btn btn-primary btn-sm" onClick={ e => doEditCategory(e) }>
                                  Save
                              </button>
                            : ''
                        }
                    </div>
                </td>
                <td>
                    <Link className="btn btn-primary btn-sm" to={ "/admin/dashboard/category/" + props.category.categoryId }>
                        List Games
                    </Link>

                    &nbsp;&nbsp;

                    <Link className="btn btn-primary btn-sm" to={ "/admin/dashboard/category/" + props.category.categoryId + "/items/add" }>
                        Add Game
                    </Link>
                </td>
            </tr>
        );
    }

    function AdminCategoryAddRow() {
        const [ category_name, setName ] = useState<string>("");

        const nameChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
            setName( e.target.value );
        }

        const doAddCategory = (e: any) => {
            api("post", "/api/category", "administrator", { category_name })
            .then(res => {
                if (res.status === 'error') {
                    return setErrorMessage("Could not add this category!");
                }

                loadCategories();

                setName("");
                setShowAddNewCategory(false);
            });
        }

        return (
            <tr>
                <td> </td>
                <td>
                    <div className="input-group">
                        <input className="form-control form-control-sm"
                               type="text"
                               onChange={ e => nameChanged(e) }
                               value={ category_name } />
                        { category_name.trim().length >= 4 && category_name.trim().length <= 32
                            ? <button className="btn btn-primary btn-sm" onClick={ e => doAddCategory(e) }>
                                  Save
                              </button>
                            : ''
                        }
                    </div>
                </td>
                <td>
                    <button className="btn btn-danger btn-sm" onClick={ () => {
                        setShowAddNewCategory(false);
                        setName("");
                    } }>
                        Cancel
                    </button>
                </td>
            </tr>
        );
    }

    const loadCategories = () => {
        api("get", "/api/category", "administrator")
        .then((apiResponse: { status: string; data: React.SetStateAction<ICategory[]>; }) => {
            console.log("GET categories response: ", apiResponse);

            if (apiResponse.status === 'ok') {
                return setCategories(apiResponse.data);
            }

            throw new Error("Unknown error while loading categories...");
        })
        .catch(error => {
            setErrorMessage(error?.message ?? 'Unknown error while loading categories...');
        });
    }

    useEffect(() => {
        loadCategories();
    }, [ ]);

    return (
        <div>
            { errorMessage && <p>Error: { errorMessage }</p> }
            { !errorMessage &&
                <div>
                    <button className="btn btn-primary btn-sm" onClick={() => setShowAddNewCategory(true)}>Add new category</button>

                    <table className="table table-bordered table-striped table-hover table-sm mt-3">
                        <thead>
                            <tr>
                                <th className="category-row-id">ID</th>
                                <th>Name</th>
                                <th className="category-row-options">Options</th>
                            </tr>
                        </thead>
                        <tbody>
                            { showAddNewCategory && <AdminCategoryAddRow /> }
                            { categories.map(category => <AdminCategoryListRow key={ "category-row-" + category.categoryId } category={ category } />) }
                        </tbody>
                    </table>
                </div>
            }
        </div>
    );
}