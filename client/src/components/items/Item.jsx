import React, {useEffect, useState} from "react";
import CategorySelector from "./selectors/CategorySelector";
import BrandSelector from "./selectors/BrandSelector";
import ConditionSelector from "./selectors/ConditionSelector";
import SizeSelector from "./selectors/SizeSelector";
import axios from "axios";
import config from "../../config";
import {useLanguage} from "../../LanguageContext.jsx";
import PriceSelector from "./selectors/PriceSelector.jsx";

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
                   <div key={item._id}>
                       {item.photos && item.photos.length > 0 ?
                           <img src={item.photos[0]} alt={item.title}/>
                           :
                           <img src="/elements/placeholder.jpg" alt={item.title}/>
                       }
                       <h3>{item.title}</h3>
                       <p>{item.description}</p>
                   </div>
               ))
           }
       </>
    );
}

export default ItemList;