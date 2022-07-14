import { Link, useNavigate } from 'react-router-dom';
import AppStore from "../../stores/AppStore";

export default function MenuUser() {

    const navigate = useNavigate();

    function doLogOut(){
        AppStore.dispatch({type: "auth.reset"});
        navigate("/auth/user/login");
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
                <Link className="navbar-brand" to="/">Hi, {AppStore.getState().auth.identity}</Link>

                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <div className="navbar-nav">
                        <Link className="nav-item nav-link" to="/categories">Categories</Link>
                        <Link className="nav-item nav-link" to="/contact">Contact</Link>
                        <button className='btn btn-primary' onClick={() => doLogOut()}>Logout</button>
                    </div>
                </div>
            </nav>
    )
}