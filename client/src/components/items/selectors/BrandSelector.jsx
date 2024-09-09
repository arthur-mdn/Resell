import React, { useState, useEffect } from "react";
import Modal from "../../Modal.jsx";
import axios from "axios";
import config from "../../../config.js";
import {useLanguage} from "../../../LanguageContext.jsx";
import {FaCheck, FaChevronRight, FaSearch} from "react-icons/fa";

function BrandSelector({ onBrandSelect, initialBrand }) {
    const { translations } = useLanguage();

    const [isOpen, setIsOpen] = useState(false);
    const [brands, setBrands] = useState([]);
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

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

    useEffect(() => {
        if (initialBrand) {
            const selectedBrand = brands.find(brand => brand._id === initialBrand);
            setSelectedBrand(selectedBrand);
        }
    }, [initialBrand, brands]);

    const handleBrandSelect = (brand) => {
        setSelectedBrand(brand);
        onBrandSelect(brand);
        setIsOpen(false);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    const filteredBrands = brands.filter(brand => {
        return (
            brand.name.toLowerCase().includes(searchTerm) ||
                brand.name.replace(/ /g, "").toLowerCase().includes(searchTerm) ||
            (brand._id ? brand._id.toLowerCase().includes(searchTerm) : false)
        );
    });

    return (
        <>
            <button type="button" onClick={() => setIsOpen(true)} className={"setting_element"}>
                <span>{translations.brand}</span>
                <div className={"fr g0-5 ai-c"}>
                    <span>{selectedBrand ? selectedBrand.name : ""}</span>
                    <FaChevronRight/>
                </div>
            </button>

            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} padding={0} title="Select Brand" overflowY={"scroll"}>
                <div className={"search-bar"}>
                    <FaSearch/>
                    <input type="search" placeholder={"Rechercher"} onChange={handleSearchChange}/>
                </div>
                <ul className={"setting_elements"}>
                    {filteredBrands.map((brand) => (
                        <li key={brand._id} onClick={() => handleBrandSelect(brand)} className={"setting_element"}>
                            <div className={"fr g1 ai-c"}>
                                {selectedBrand && selectedBrand._id === brand._id && <FaCheck/>}
                                <span>{brand.name}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            </Modal>
        </>
    );
}

export default BrandSelector;