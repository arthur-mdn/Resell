import React, {useEffect, useState} from "react";
import CategorySelector from "./selectors/CategorySelector";
import BrandSelector from "./selectors/BrandSelector";
import ConditionSelector from "./selectors/ConditionSelector";
import SizeSelector from "./selectors/SizeSelector";
import axios from "axios";
import config from "../../config";
import {useLanguage} from "../../LanguageContext.jsx";
import PriceSelector from "./selectors/PriceSelector.jsx";

function Item({item}) {
    const { translations } = useLanguage();
    return (
       <div className={"item-card"}>
           {item.photos && item.photos.length > 0 ?
               <img src={item.photos[0]} alt={item.title}/>
               :
               <img src="/elements/placeholder.jpg" alt={item.title}/>
           }
           <div className={"item-card-details"}>
               <div className={"fr g0-5 ai-c"}>
                   <h4>{item.brand.name}</h4> - <h4>{item.size.name}</h4>
               </div>
               <h3>{item.title}</h3>
               <p>{item.description}</p>
           </div>
       </div>
    );
}

export default Item;