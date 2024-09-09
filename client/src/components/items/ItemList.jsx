import React, {useEffect, useState} from "react";
import CategorySelector from "./selectors/CategorySelector";
import BrandSelector from "./selectors/BrandSelector";
import ConditionSelector from "./selectors/ConditionSelector";
import SizeSelector from "./selectors/SizeSelector";
import axios from "axios";
import config from "../../config";
import {useLanguage} from "../../LanguageContext.jsx";
import PriceSelector from "./selectors/PriceSelector.jsx";
import Item from "./ItemCard.jsx";
import ItemCard from "./ItemCard.jsx";

function ItemList() {
    const { translations } = useLanguage();

    const [items, setItems] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const itemsResponse = await axios.get(`${config.serverUrl}/items`, {withCredentials: true});

                setItems(itemsResponse.data);
            } catch (error) {
                console.error("Error fetching data", error);
            }
        };
        fetchData();
    }, []);


    return (
       <>
           {
               items.map(item => (
                    <a href={`/item/${item._id}/view`} key={item._id}>
                        <ItemCard item={item} key={item._id}/>
                    </a>
               ))
           }
           {items.length === 0 && <p>{translations.noItems}</p>}
       </>
    );
}

export default ItemList;