import { useState, useEffect } from "react";
import axios from "axios";
import config from "../config";

function AddItem() {
    const [itemData, setItemData] = useState({
        title: "",
        description: "",
        category: "",
        brand: "",
        condition: "",
        size: "",
    });
    const [error, setError] = useState("");
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [conditions, setConditions] = useState([]);
    const [sizes, setSizes] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const categoriesResponse = await axios.get(`${config.serverUrl}/items/categories`, {withCredentials: true});
                const brandsResponse = await axios.get(`${config.serverUrl}/items/brands`, {withCredentials: true});
                const conditionsResponse = await axios.get(`${config.serverUrl}/items/conditions`, {withCredentials: true});

                setCategories(categoriesResponse.data);
                setBrands(brandsResponse.data);
                setConditions(conditionsResponse.data);
            } catch (error) {
                console.error("Error fetching data", error);
            }
        };
        fetchData();
    }, []);

    const handleChange = async (e) => {
        setItemData({
            ...itemData,
            [e.target.name]: e.target.value,
        });
        if (e.target.name === "category") {
            const sizesResponse = await axios.get(`${config.serverUrl}/items/sizes/${e.target.value}`, {withCredentials: true});
            setSizes(sizesResponse.data);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { title, description, category, brand, condition, size, photos } = itemData;

        if (!title || !description || !category || !brand || !condition || !size) {
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
                photos
            }, {
                withCredentials: true
            });

            console.log("Item created:", response.data);
            setItemData({
                title: "",
                description: "",
                category: "",
                brand: "",
                condition: "",
                size: "",
                photos: []
            });
        } catch (error) {
            console.error("Error creating item:", error);
            setError("Error creating item");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p1">
            <input
                type="text"
                name="title"
                value={itemData.title}
                onChange={handleChange}
                placeholder="Item Title"
                required
            />
            <textarea
                name="description"
                value={itemData.description}
                onChange={handleChange}
                placeholder="Item Description"
                required
            />
            <select
                name="category"
                value={itemData.category}
                onChange={handleChange}
                required
            >
                <option value="" disabled={true}>Select Category</option>
                {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                        {category.name}
                    </option>
                ))}
            </select>
            <select
                name="brand"
                value={itemData.brand}
                onChange={handleChange}
                required
            >
                <option value="" disabled={true}>Select Brand</option>
                {brands.map((brand) => (
                    <option key={brand._id} value={brand._id}>
                        {brand.name}
                    </option>
                ))}
            </select>
            <select
                name="condition"
                value={itemData.condition}
                onChange={handleChange}
                required
            >
                <option value="" disabled={true}>Select Condition</option>
                {conditions.map((condition) => (
                    <option key={condition._id} value={condition._id}>
                        {condition.title}
                    </option>
                ))}
            </select>
            <select
                name="size"
                value={itemData.size}
                onChange={handleChange}
                required
            >
                <option value="" disabled={true}>Select Size</option>
                {sizes.map((size) => (
                    <option key={size._id} value={size._id}>
                        {size.size}
                    </option>
                ))}
            </select>

            <button type="submit">Add Item</button>
            {error && <p>{error}</p>}
        </form>
    );
}

export default AddItem;