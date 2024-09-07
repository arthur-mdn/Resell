import {useEffect, useState} from "react";
import axios from "axios";
import config from "../config";
import ItemList from "../components/items/ItemList.jsx";

function Accueil() {

    return (
        <>
            <div>
                Accueil
            </div>
            <div>
                <ItemList/>
            </div>
        </>
    );

}

export default Accueil;
