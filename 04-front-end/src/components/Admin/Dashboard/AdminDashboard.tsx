import React from "react";
import { faPlusSquare } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
    return (
        <div className="row">
            <div className="col-12 col-lg-4 col-md-6 col-xl-3 p-3">
                <div className="card">
                    <div className="card-body">
                        <div className="card-title">
                            <h2 className="h5">Categories</h2>
                        </div>
                        <div className="card-text d-grid gap-3">
                            <Link className="btn btn-primary" to="/admin/dashboard/categories">List all</Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-12 col-lg-4 col-md-6 col-xl-3 p-3">
                <div className="card">
                    <div className="card-body">
                        <div className="card-title">
                            <h2 className="h5">Platforms</h2>
                        </div>
                        <div className="card-text d-grid gap-3">
                            <Link className="btn btn-primary" to="/admin/dashboard/platform">List all</Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-12 col-lg-4 col-md-6 col-xl-3 p-3">
                <div className="card">
                    <div className="card-body">
                        <div className="card-title">
                            <h2 className="h5">Games</h2>
                        </div>
                        <div className="card-text d-grid gap-3">
                            <Link className="btn btn-primary" to="/admin/dashboard/game">List all</Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-12 col-lg-4 col-md-6 col-xl-3 p-3">
                <div className="card">
                    <div className="card-body">
                        <div className="card-title">
                            <h2 className="h5">Administrators</h2>
                        </div>
                        <div className="card-text">
                            <div className="btn-group w-100">
                                <Link className="btn btn-primary" to="/admin/dashboard/administrator/list">List all</Link>
                                <Link className="btn btn-success" to="/admin/dashboard/administrator/add">
                                    <FontAwesomeIcon icon={ faPlusSquare } /> Add
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-12 col-lg-4 col-md-6 col-xl-3 p-3">
                <div className="card">
                    <div className="card-body">
                        <div className="card-title">
                            <h2 className="h5">Users</h2>
                        </div>
                        <div className="card-text d-grid gap-3">
                            <Link className="btn btn-primary" to="/admin/dashboard/user/list">List all</Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-12 col-lg-4 col-md-6 col-xl-3 p-3">
                <div className="card">
                    <div className="card-body">
                        <div className="card-title">
                            <h2 className="h5">Review</h2>
                        </div>
                        <div className="card-text d-grid gap-3">
                            <Link className="btn btn-primary" to="/admin/dashboard/review/list">List all unchecked</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}