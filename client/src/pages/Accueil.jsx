import React, {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {useCookies} from "react-cookie";

function Accueil() {
    const navigate = useNavigate();

    return (
        <>
            <div>
                Accueil
            </div>
        </>
    );

}

export default Accueil;
