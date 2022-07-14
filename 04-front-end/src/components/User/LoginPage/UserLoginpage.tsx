import { useState } from "react";
import api from '../../../api/api';
import AppStore from '../../../stores/AppStore';
import { useNavigate } from 'react-router-dom';

function UserLoginPage(){
  const [ email, setEmail ] = useState<string>("");
  const [ password, setPassword ] = useState<string>("");
  const [ errMessage, setErrMessage ] = useState<string>("");

  const navigate = useNavigate();

  const doLogin = () => {
    api("post", "/api/auth/user/login", "user", {email, password})
    .then(res => {
      if(res.status !== "ok"){
        throw new Error("Could not log in.")
      }

      return res.data;
    }
    )
    .then(data => {
      AppStore.dispatch( { type: "auth.update", key: "authToken", value: data?.authToken } );
      AppStore.dispatch( { type: "auth.update", key: "refreshToken", value: data?.refreshToken } );
      AppStore.dispatch( { type: "auth.update", key: "identity", value: email } );
      AppStore.dispatch( { type: "auth.update", key: "id", value: +(data?.id) } );
      AppStore.dispatch( { type: "auth.update", key: "role", value: "user" } );

      navigate("/categories", {
          replace: true,
      });
    })
    .catch(err => {
      setErrMessage(err?.message ?? "Cud not log in");

      setTimeout(() => {
        setErrMessage("");
      }, 3500)
    })
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
        <div className="form-group mb-3">
            <button className="btn btn-primary px-5" onClick={ () => doLogin() }> Log In </button>
        </div>

        {errMessage && <p className="alert alert-danger"> {errMessage}</p>}
      </div>
    </div>  
  );
}

export default UserLoginPage;