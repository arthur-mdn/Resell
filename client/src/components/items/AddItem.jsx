import React, { useState } from "react";
import CategorySelector from "./selectors/CategorySelector";
import BrandSelector from "./selectors/BrandSelector";
import ConditionSelector from "./selectors/ConditionSelector";
import SizeSelector from "./selectors/SizeSelector";
import axios from "axios";
import config from "../../config";
import {useLanguage} from "../../LanguageContext.jsx";
import PriceSelector from "./selectors/PriceSelector.jsx";

function AddItem() {
    const { translations } = useLanguage();

    const [itemData, setItemData] = useState({
        title: "",
        description: "",
        category: "",
        brand: "",
        condition: "",
        size: "",
        price: {
            buyPrice: "",
            estimatedPrice: "",
            floorPrice: "",
        }
    });
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { title, description, category, brand, condition, size, price } = itemData;

        if (!title || !description || !category || !brand || !condition || !size || !price.buyPrice || !price.estimatedPrice || !price.floorPrice) {
            setError("All fields are required");
            return;
        }

        try {
            const response = await axios.post(`${config.serverUrl}/items`, {
                title,
                description,
                category,
                brand,
                condition,
                size,
                price
            }, {
                withCredentials: true,
            });

            console.log("Item created:", response.data);
            setItemData({
                title: "",
                description: "",
                category: "",
                brand: "",
                condition: "",
                size: "",
                price: {
                    buyPrice: "",
                    estimatedPrice: "",
                    floorPrice: "",
                }
            });
        } catch (error) {
            console.error("Error creating item:", error);
            setError("Error creating item");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="fc g1 p1">
                <h2>{translations.addAnItem}</h2>

                <div className={"input_container"}>
                    <label htmlFor="title">
                        {translations.itemTitle}
                    </label>
                    <input
                        type="text"
                        id={"title"}
                        name="title"
                        value={itemData.title}
                        onChange={(e) => setItemData({...itemData, title: e.target.value})}
                        placeholder={translations.itemTitle}
                        required
                    />
                </div>

                <div className={"input_container"}>
                    <label htmlFor="description">
                        {translations.itemDescription}
                    </label>
                    <textarea
                        id={"description"}
                        name="description"
                        value={itemData.description}
                        onChange={(e) => setItemData({...itemData, description: e.target.value})}
                        placeholder={translations.itemDescription}
                        required
                    />
                </div>

            </div>


            <CategorySelector onCategorySelect={(category) => setItemData({...itemData, category: category._id})}/>
            <SizeSelector categoryId={itemData.category} onSizeSelect={(size) => setItemData({...itemData, size: size._id})}/>
            <BrandSelector onBrandSelect={(brand) => setItemData({...itemData, brand: brand._id})}/>
            <ConditionSelector onConditionSelect={(condition) => setItemData({...itemData, condition: condition._id})}/>
            <PriceSelector onPriceSelect={(price) => setItemData({...itemData, price: price})}/>

            <div className={"fc g1 p1"}>
                <button type="submit">
                    {translations.addItem}
                </button>
                {error && <p>{error}</p>}
            </div>

        </form>
    );
}

export default AddItem;