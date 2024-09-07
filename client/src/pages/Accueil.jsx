import {useEffect, useState} from "react";
import axios from "axios";
import config from "../config";
import ItemList from "../components/items/ItemList.jsx";
import {useLanguage} from "../LanguageContext.jsx";

function Accueil() {
    const {translations} = useLanguage();
    return (
        <>
            <div className={"p1 fc g1"}>
                <h2>{translations.home}</h2>
                <ItemList/>
            </div>
        </>
    );

}

export default Accueil;
