import { Link } from "react-router-dom";

export default function MenuVisitor() {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
                <Link className="navbar-brand" to="/">Home page</Link>

                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <div className="navbar-nav">
                        <Link className="nav-item nav-link" to="/auth/user/login">User login</Link>
                        <Link className="nav-item nav-link" to="/auth/user/register">User register</Link>
                        <Link className="nav-item nav-link" to="/categories">Categories</Link>
                        <Link className="nav-item nav-link" to="/games">Games</Link>
                        <Link className="nav-item nav-link" to="/platforms">Platofrms</Link>
                        <Link className="nav-item nav-link" to="/contact">Contact</Link>
                        <Link className="nav-item nav-link" to="/auth/admin/login">Admin login</Link>
                    </div>
                </div>
            </nav>
    )
}