import {useLanguage} from "../../LanguageContext.jsx";

function Item({item}) {
    const { translations } = useLanguage();
    return (
       <div className={"item-card"}>
           <div className={"item-card-img"}>
               <div className={`item-card-condition condition-${item.condition.condition}`}>
                     <span>{translations.conditions && translations.conditions[item.condition.name] || item.condition.name}</span>
               </div>
               {item.photos && item.photos.length > 0 ?
                   <img src={item.photos[0]} alt={item.title}/>
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
       </div>
    );
}

export default Item;