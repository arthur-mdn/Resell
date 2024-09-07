import React, { useState, useEffect } from "react";
import Modal from "../../Modal.jsx";
import axios from "axios";
import config from "../../../config.js";
import { useLanguage } from "../../../LanguageContext.jsx";
import { FaCheck, FaChevronLeft, FaChevronRight } from "react-icons/fa";

function CategorySelector({ onCategorySelect }) {
    const { translations } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null); // Sélection confirmée
    const [tempSelectedCategory, setTempSelectedCategory] = useState(null); // Sélection temporaire
    const [currentCategories, setCurrentCategories] = useState([]);  // Catégories actuellement affichées
    const [parentCategory, setParentCategory] = useState(null);      // Parent de la catégorie actuelle
    const [isNavigating, setIsNavigating] = useState(false); // Pour suivre si l'utilisateur navigue dans les sous-catégories

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

    const openModal = () => {
        if (!isNavigating) {
            // Si on n'est pas en train de naviguer, réinitialiser la vue sur les catégories de premier niveau
            const topLevelCategories = categories.filter(category => category.parentCategory === null);
            setCurrentCategories(topLevelCategories);
            setParentCategory(null); // Revenir à la racine
        }
        setTempSelectedCategory(selectedCategory); // Réinitialiser la sélection temporaire à la dernière catégorie confirmée
        setIsOpen(true);
    };

    const handleCategorySelect = (category) => {
        setTempSelectedCategory(category); // Mettre à jour la sélection temporaire dès que l'on sélectionne une catégorie
        if (category.subCategories.length > 0) {
            // Charger les sous-catégories et changer la vue
            const subCategories = categories.filter(cat => category.subCategories.includes(cat._id));
            setParentCategory(category);  // Garder la trace du parent pour revenir en arrière
            setCurrentCategories(subCategories);
            setIsNavigating(true); // Indiquer que l'utilisateur navigue dans les sous-catégories
        }
    };

    const handleBack = () => {
        if (parentCategory && parentCategory.parentCategory === null) {
            // Si on est au premier niveau, afficher les catégories de premier niveau
            const topLevelCategories = categories.filter(category => category.parentCategory === null);
            setCurrentCategories(topLevelCategories);
            setParentCategory(null); // On revient au niveau racine
            setIsNavigating(false); // Indiquer qu'on est de retour au niveau de base
        } else if (parentCategory) {
            // Si on est dans une sous-catégorie, remonter d'un niveau
            const grandParent = categories.find(category => category._id === parentCategory.parentCategory);
            const parentSubCategories = categories.filter(cat => grandParent.subCategories.includes(cat._id));
            setCurrentCategories(parentSubCategories);
            setParentCategory(grandParent);
        }
    };

    const handleConfirm = () => {
        setSelectedCategory(tempSelectedCategory); // Confirmer la sélection temporaire
        onCategorySelect(tempSelectedCategory);    // Envoyer la catégorie sélectionnée au parent
        setIsOpen(false);
    };

    const handleClose = () => {
        // Conserver la navigation en réinitialisant seulement la sélection temporaire à la dernière sélection confirmée
        setTempSelectedCategory(selectedCategory);
        setIsOpen(false);
    };

    return (
        <>
            <button type="button" onClick={openModal} className={"setting_element"}>
                <span>{translations.category}</span>
                <div className={"fr g0-5 ai-c"}>
                    <span>{selectedCategory ? selectedCategory.name : ""}</span>
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
                                    <span>{category.name}</span>
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