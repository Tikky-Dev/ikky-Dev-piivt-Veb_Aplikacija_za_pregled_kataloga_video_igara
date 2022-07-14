import { useState } from "react";
import { Link } from "react-router-dom";
import AppStore from "../../stores/AppStore";
import MenuAdmin from "./MenuAdmin";
import MenuUser from "./MenuUser";
import MenuVisitor from "./MenuVisitor";

function Menu(){
    const [ role, setRole ] = useState<"visitor" | "user" | "administrator">(AppStore.getState().auth.role);

    AppStore.subscribe(() => {
        setRole(AppStore.getState().auth.role);
    });
    
    return(
        <>

            {role === "visitor" && <MenuVisitor/>}
            {role === "user" && <MenuUser/>}
            {role === "administrator" && <MenuAdmin/>}
        </>
    );
}

export default Menu;