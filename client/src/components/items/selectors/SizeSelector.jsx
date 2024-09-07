import React, { useState, useEffect } from "react";
import Modal from "../../Modal.jsx";
import axios from "axios";
import config from "../../../config.js";
import {useLanguage} from "../../../LanguageContext.jsx";
import {FaCheck, FaChevronRight} from "react-icons/fa";

function SizeSelector({ categoryId, onSizeSelect }) {
    const { translations } = useLanguage();

    const [isOpen, setIsOpen] = useState(false);
    const [sizes, setSizes] = useState([]);
    const [selectedSize, setSelectedSize] = useState(null);

    useEffect(() => {
        console.log("categoryId", categoryId);
        if (categoryId) {
            const fetchSizes = async () => {
                try {
                    const sizesResponse = await axios.get(`${config.serverUrl}/items/sizes/${categoryId}`, { withCredentials: true });
                    setSizes(sizesResponse.data);
                } catch (error) {
                    console.error("Error fetching sizes:", error);
                }
            };
            fetchSizes();
        }
    }, [categoryId]);

    const handleSizeSelect = (size) => {
        setSelectedSize(size);
        onSizeSelect(size);
        setIsOpen(false);
    };

    return (
        <>
            <button type="button" onClick={() => setIsOpen(true)} className={"setting_element"}>
                <span>{translations.size}</span>
                <div className={"fr g0-5 ai-c"}>
                    <span>{selectedSize ? selectedSize.size : ""}</span>
                    <FaChevronRight/>
                </div>
            </button>

            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} padding={0} title="Select Size">
                <ul>
                    {sizes.map((size) => (
                        <li key={size._id} onClick={() => handleSizeSelect(size)} className={"setting_element"}>
                            <div className={"fr g1 ai-c"}>
                                {selectedSize && selectedSize._id === size._id && <FaCheck/>}
                                {size.name}
                            </div>
                        </li>
                    ))}
                </ul>
            </Modal>
        </>
    );
}

export default SizeSelector;