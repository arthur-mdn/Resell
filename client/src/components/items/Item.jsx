import {useLanguage} from "../../LanguageContext.jsx";
import config from "../../config";
import {Link, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";

function Item() {
    const { translations } = useLanguage();
    const { id } = useParams();
    const [item, setItemData] = useState(null);
    useEffect( () => {
        if (id) {
            const fetchData = async () => {
                try {
                    const itemResponse = await axios.get(`${config.serverUrl}/item/${id}`, {withCredentials: true});
                    const item = itemResponse.data;
                    setItemData({
                        title: item.title,
                        description: item.description,
                        category: item.category,
                        brand: item.brand,
                        condition: item.condition,
                        size: item.size,
                        price: item.price,
                        photos: item.photos
                    });
                    console.log(item.photos);
                } catch (error) {
                    console.error("Error fetching data", error);
                }
            };
            fetchData();
            console.log(item);
        }
    }, [id]);

    if (!item) {
        return <p>{translations.loading}</p>;
    } else {
        console.log(item);
    }
    return (
       <div className={"fc g0-5 p1"}>
           <div className={"item-card-img"}>
               <div className={`item-card-condition condition-${item.condition.condition}`}>
                     <span>{translations.conditions && translations.conditions[item.condition.name] || item.condition.name}</span>
               </div>
               {item.photos && item.photos.length > 0 ?
                   <img src={`${item.photos[0].where === "server" ? config.serverUrl : ""}/${item.photos[0].value}`} alt={item.title}/>
                   :
                   <img src="/elements/placeholder.jpg" alt={item.title}/>
               }
           </div>
           <div className={"item-card-details"}>
               <div className={"fr g0-5 ai-c"}>
                   <h4>{item.brand.name}</h4> - <h4 className={"uppercase"}>{item.size.name}</h4>
               </div>
               <h3>{item.title}</h3>
               <p>{item.description}</p>
           </div>
           <div>
                <h4>{item.price.buyPrice}</h4>
                <h4>{item.price.estimatedPrice}</h4>
                <h4>{item.price.floorPrice}</h4>
           </div>
           <div>
               <Link to={`/item/${id}/edit`} className={"force_button_style"}>{translations.edit}</Link>
           </div>
       </div>
    );
}

export default Item;