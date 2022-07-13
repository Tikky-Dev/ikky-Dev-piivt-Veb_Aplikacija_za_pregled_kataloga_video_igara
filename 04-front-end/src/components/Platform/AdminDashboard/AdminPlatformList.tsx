import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../api/api";
import IPlatform from "../../../models/IPlatform.model";
import './AdminPlatformList.sass';

interface IAdminPlatformListRowProperties {
    platform: IPlatform,
}

export default function AdminPlatformList() {
    const [ platforms, setCategories ] = useState<IPlatform[]>([]);
    const [ errorMessage, setErrorMessage ] = useState<string>("");
    const [ showAddNewPlatform, setShowAddNewPlatform ] = useState<boolean>(false);

    function AdminPlatformListRow(props: IAdminPlatformListRowProperties) {
        const [ platformName, setName ] = useState<string>(props.platform.name);

        const nameChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
            setName( e.target.value );
        }

        const doEditPlatform = (e: any) => {
            api("put", "/api/platform/" + props.platform.platformId, "administrator", { platformName })
            .then(res => {
                if (res.status === 'error') {
                    return setErrorMessage("Could not edit this platform!");
                }

                loadCategories();
            })
        }

        return (
            <tr>
                <td>{ props.platform.platformId }</td>
                <td>
                    <div className="input-group">
                        <input className="form-control form-control-sm"
                               type="text"
                               onChange={ e => nameChanged(e) }
                               value={ platformName } />
                        { props.platform.name !== platformName
                            ? <button className="btn btn-primary btn-sm" onClick={ e => doEditPlatform(e) }>
                                  Save
                              </button>
                            : ''
                        }
                    </div>
                </td>
                <td>
                    <Link className="btn btn-primary btn-sm" to={ "/admin/dashboard/platform/" + props.platform.platformId }>
                        List Games
                    </Link>

                    &nbsp;&nbsp;

                    <Link className="btn btn-primary btn-sm" to={ "/admin/dashboard/platform/" + props.platform.platformId + "/items/add" }>
                        Add Game
                    </Link>
                </td>
            </tr>
        );
    }

    function AdminPlatformAddRow() {
        const [ platform_name, setName ] = useState<string>("");

        const nameChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
            setName( e.target.value );
        }

        const doAddPlatform = (e: any) => {
            api("post", "/api/platform", "administrator", { platform_name })
            .then(res => {
                if (res.status === 'error') {
                    return setErrorMessage("Could not add this platform!");
                }

                loadCategories();

                setName("");
                setShowAddNewPlatform(false);
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
                               value={ platform_name } />
                        { platform_name.trim().length >= 4 && platform_name.trim().length <= 32
                            ? <button className="btn btn-primary btn-sm" onClick={ e => doAddPlatform(e) }>
                                  Save
                              </button>
                            : ''
                        }
                    </div>
                </td>
                <td>
                    <button className="btn btn-danger btn-sm" onClick={ () => {
                        setShowAddNewPlatform(false);
                        setName("");
                    } }>
                        Cancel
                    </button>
                </td>
            </tr>
        );
    }

    const loadCategories = () => {
        api("get", "/api/platform", "administrator")
        .then((apiResponse: { status: string; data: React.SetStateAction<IPlatform[]>; }) => {
            console.log("GET platforms response: ", apiResponse);

            if (apiResponse.status === 'ok') {
                return setCategories(apiResponse.data);
            }

            throw new Error("Unknown error while loading platforms...");
        })
        .catch(error => {
            setErrorMessage(error?.message ?? 'Unknown error while loading platforms...');
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
                    <button className="btn btn-primary btn-sm" onClick={() => setShowAddNewPlatform(true)}>Add new platform</button>

                    <table className="table table-bordered table-striped table-hover table-sm mt-3">
                        <thead>
                            <tr>
                                <th className="platform-row-id">ID</th>
                                <th>Name</th>
                                <th className="platform-row-options">Options</th>
                            </tr>
                        </thead>
                        <tbody>
                            { showAddNewPlatform && <AdminPlatformAddRow /> }
                            { platforms.map(platform => <AdminPlatformListRow key={ "platform-row-" + platform.platformId } platform={ platform } />) }
                        </tbody>
                    </table>
                </div>
            }
        </div>
    );
}