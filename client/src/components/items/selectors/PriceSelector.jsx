import React, { useState, useEffect } from "react";
import Modal from "../../Modal.jsx";
import axios from "axios";
import config from "../../../config.js";
import {useLanguage} from "../../../LanguageContext.jsx";
import {FaChevronRight} from "react-icons/fa";

function PriceSelector({ onPriceSelect, initialPrice }) {
    const { translations } = useLanguage();

    const [isOpen, setIsOpen] = useState(false);
    const [buyPrice, setBuyPrice] = useState("");
    const [estimatedPrice, setEstimatedPrice] = useState("");
    const [floorPrice, setFloorPrice] = useState("");

    const handlePriceSelect = () => {
        onPriceSelect({ buyPrice, estimatedPrice, floorPrice });
        setIsOpen(false);
    };

    useEffect(() => {
        if (initialPrice) {
            setBuyPrice(initialPrice.buyPrice);
            setEstimatedPrice(initialPrice.estimatedPrice);
            setFloorPrice(initialPrice.floorPrice);
        }
    }, [initialPrice]);

    return (
        <>
            <button type="button" onClick={() => setIsOpen(true)} className={"setting_element"}>
                <span>{translations.price}</span>
                <div className={"fr g0-5 ai-c"}>
                    <span>{buyPrice || estimatedPrice || floorPrice ? `${buyPrice} - ${estimatedPrice} - ${floorPrice}` : ""}</span>
                    <FaChevronRight/>
                </div>
            </button>

            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={translations.price}>
                <div>
                    <label htmlFor="buyPrice">
                        {translations.buyPrice}
                    </label>
                    <input type="text" id="buyPrice" value={buyPrice} onChange={(e) => setBuyPrice(e.target.value)} />
                </div>
                <div>
                    <label htmlFor="estimatedPrice">
                        {translations.estimatedPrice}
                    </label>
                    <input type="text" id="estimatedPrice" value={estimatedPrice} onChange={(e) => setEstimatedPrice(e.target.value)} />
                </div>
                <div>
                    <label htmlFor="floorPrice">
                        {translations.floorPrice}
                    </label>
                    <input type="text" id="floorPrice" value={floorPrice} onChange={(e) => setFloorPrice(e.target.value)} />
                </div>
                <button type="button" onClick={handlePriceSelect}>
                    {translations.save}
                </button>
            </Modal>
        </>
    );
}

export default PriceSelector;