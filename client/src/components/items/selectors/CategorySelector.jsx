import React, { useState, useEffect } from "react";
import Modal from "../../Modal.jsx";
import axios from "axios";
import config from "../../../config.js";
import { useLanguage } from "../../../LanguageContext.jsx";
import { FaCheck, FaChevronLeft, FaChevronRight } from "react-icons/fa";

function CategorySelector({ onCategorySelect, initialCategory }) {
    const { translations } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [tempSelectedCategory, setTempSelectedCategory] = useState(null);
    const [currentCategories, setCurrentCategories] = useState([]);
    const [parentCategory, setParentCategory] = useState(null);
    const [isNavigating, setIsNavigating] = useState(false);

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

    useEffect(() => {
        if (initialCategory) {
            const selectedCat = categories.find(cat => cat._id === initialCategory);
            setSelectedCategory(selectedCat);
            setTempSelectedCategory(selectedCat);
        }
    }, [initialCategory, categories]);

    const openModal = () => {
        if (!isNavigating) {
            const topLevelCategories = categories.filter(category => category.parentCategory === null);
            setCurrentCategories(topLevelCategories);
            setParentCategory(null);
        }
        setTempSelectedCategory(selectedCategory);
        setIsOpen(true);
    };

    const handleCategorySelect = (category) => {
        setTempSelectedCategory(category);
        if (category.subCategories.length > 0) {
            const subCategories = categories.filter(cat => category.subCategories.includes(cat._id));
            setParentCategory(category);
            setCurrentCategories(subCategories);
            setIsNavigating(true);
        }
    };

    const handleBack = () => {
        if (parentCategory && parentCategory.parentCategory === null) {
            const topLevelCategories = categories.filter(category => category.parentCategory === null);
            setCurrentCategories(topLevelCategories);
            setParentCategory(null);
            setIsNavigating(false);
        } else if (parentCategory) {
            const grandParent = categories.find(category => category._id === parentCategory.parentCategory);
            const parentSubCategories = categories.filter(cat => grandParent.subCategories.includes(cat._id));
            setCurrentCategories(parentSubCategories);
            setParentCategory(grandParent);
        }
    };

    const handleConfirm = () => {
        setSelectedCategory(tempSelectedCategory);
        onCategorySelect(tempSelectedCategory);
        setIsOpen(false);
    };

    const handleClose = () => {
        setTempSelectedCategory(selectedCategory);
        setIsOpen(false);
    };

    return (
        <>
            <button type="button" onClick={openModal} className={"setting_element"}>
                <span>{translations.category}</span>
                <div className={"fr g0-5 ai-c"}>
                    <span>{(selectedCategory && translations.categories && translations.categories[selectedCategory.name]) ? translations.categories[selectedCategory.name] : ""}</span>
                    <FaChevronRight />
                </div>
            </button>

            <Modal isOpen={isOpen} onClose={handleClose} padding={0} title={translations.selectCategory}>
                <ul>
                    <button type="button" onClick={parentCategory ? handleBack : null} disabled={!parentCategory} className={"setting_element"}>
                        <div className={"fr g1 ai-c"}>
                            <FaChevronLeft /> {translations.back}
                        </div>
                    </button>

                    {currentCategories.map((category) => (
                        <li key={category._id} onClick={() => handleCategorySelect(category)} className={"setting_element"}>

                            <div className={"fr g1 jc-sb w100 ai-c"}>
                                <div className={"fr g1 ai-c"}>
                                    {tempSelectedCategory && tempSelectedCategory._id === category._id && <FaCheck />}
                                    <span>
                                        {translations.categories && translations.categories[category.name] || category.name}
                                    </span>
                                </div>
                                {category.subCategories && category.subCategories.length > 0 && <FaChevronRight />}
                            </div>
                        </li>
                    ))}
                </ul>

                <div className={"fc ai-c"}>
                    {tempSelectedCategory && (
                        <button type="button" onClick={handleConfirm} className={"confirm_button"}>
                            {translations.confirm}
                        </button>
                    )}
                </div>
            </Modal>
        </>
    );
}

export default CategorySelector;