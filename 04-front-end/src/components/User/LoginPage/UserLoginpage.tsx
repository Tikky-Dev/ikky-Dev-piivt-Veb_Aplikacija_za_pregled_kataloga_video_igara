import { useState } from "react";

function UserLoginPage(){
  const [ email, setEmail ] = useState<string>("");
  const [ password, setPassword ] = useState<string>("");

  const doLogin = () => {
    console.log("Atempt to log in: ", email, password)
  };

  
  return(
    <div className="row">
      <div className="col col-xs-12 col-md-6 offset-md-3">
        <h1 className="h4 mb-3">Log into your account</h1>
        <div className="form-group mb-3">
            <div className="input-group">
                <input className="form-control" type="text" placeholder="Enter your email" value={email}
                  onChange={ e => setEmail(e.target.value) }/>
            </div>
        </div>
        <div className="form-group mb-3">
            <div className="input-group">
                <input className="form-control" type="password" placeholder="Enter your password" value={password}
                  onChange={ e => setPassword(e.target.value) }/>
            </div>
        </div>
        <div className="form-group">
            <button className="btn btn-primary px-5" onClick={ () => doLogin() }> Log In </button>
        </div>
      </div>
    </div>  
  );
}

export default UserLoginPage;