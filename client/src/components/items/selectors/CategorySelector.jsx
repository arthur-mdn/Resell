import React, { useState, useEffect } from "react";
import Modal from "../../Modal.jsx";
import axios from "axios";
import config from "../../../config.js";
import {useLanguage} from "../../../LanguageContext.jsx";
import {FaCheck, FaChevronLeft, FaChevronRight} from "react-icons/fa";

function CategorySelector({ onCategorySelect }) {
    const { translations } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categoriesResponse = await axios.get(`${config.serverUrl}/items/categories`, { withCredentials: true });
                setCategories(categoriesResponse.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, []);

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        onCategorySelect(category); // Send the selected category back to the parent
        setIsOpen(false); // Close modal
    };

    return (
        <>
            <button type="button" onClick={() => setIsOpen(true)} className={"setting_element"}>
                <span>{translations.category}</span>
                <div className={"fr g0-5 ai-c"}>
                    <span>{selectedCategory ? selectedCategory.name : ""}</span>
                    <FaChevronRight/>
                </div>
            </button>

            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} padding={0} title="Select Category">
                <ul>
                    {categories.map((category) => (
                        <li key={category._id} onClick={() => handleCategorySelect(category)} className={"setting_element"}>
                            <div className={"fr g1 ai-c"}>
                                {selectedCategory && selectedCategory._id === category._id && <FaCheck/>}
                                {category.name}
                            </div>
                        </li>
                    ))}
                </ul>
            </Modal>
        </>
    );
}

export default CategorySelector;