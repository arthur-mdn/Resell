import React, { useState, useEffect } from "react";
import Modal from "../../Modal.jsx";
import axios from "axios";
import config from "../../../config.js";
import {useLanguage} from "../../../LanguageContext.jsx";
import {FaCheck, FaChevronRight} from "react-icons/fa";

function BrandSelector({ onBrandSelect }) {
    const { translations } = useLanguage();

    const [isOpen, setIsOpen] = useState(false);
    const [brands, setBrands] = useState([]);
    const [selectedBrand, setSelectedBrand] = useState(null);

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const brandsResponse = await axios.get(`${config.serverUrl}/items/brands`, { withCredentials: true });
                setBrands(brandsResponse.data);
            } catch (error) {
                console.error("Error fetching brands:", error);
            }
        };
        fetchBrands();
    }, []);

    const handleBrandSelect = (brand) => {
        setSelectedBrand(brand);
        onBrandSelect(brand);
        setIsOpen(false);
    };

    return (
        <>
            <button type="button" onClick={() => setIsOpen(true)} className={"setting_element"}>
                <span>{translations.brand}</span>
                <div className={"fr g0-5 ai-c"}>
                    <span>{selectedBrand ? selectedBrand.name : ""}</span>
                    <FaChevronRight/>
                </div>
            </button>

            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} padding={0} title="Select Brand">
                <ul>
                    {brands.map((brand) => (
                        <li key={brand._id} onClick={() => handleBrandSelect(brand)} className={"setting_element"}>
                            <div className={"fr g1 ai-c"}>
                                {selectedBrand && selectedBrand._id === brand._id && <FaCheck/>}
                                {brand.name}
                            </div>
                        </li>
                    ))}
                </ul>
            </Modal>
        </>
    );
}

export default BrandSelector;