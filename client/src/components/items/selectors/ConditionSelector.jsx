import React, { useState, useEffect } from "react";
import Modal from "../../Modal.jsx";
import axios from "axios";
import config from "../../../config.js";
import {useLanguage} from "../../../LanguageContext.jsx";
import {FaCheck, FaChevronRight} from "react-icons/fa";

function ConditionSelector({ onConditionSelect, initialCondition }) {
    const { translations } = useLanguage();

    const [isOpen, setIsOpen] = useState(false);
    const [conditions, setConditions] = useState([]);
    const [selectedCondition, setSelectedCondition] = useState(null);

    useEffect(() => {
        const fetchConditions = async () => {
            try {
                const conditionsResponse = await axios.get(`${config.serverUrl}/items/conditions`, { withCredentials: true });
                setConditions(conditionsResponse.data);
            } catch (error) {
                console.error("Error fetching conditions:", error);
            }
        };
        fetchConditions();
    }, []);

    useEffect(() => {
        if (initialCondition) {
            const selectedCondition = conditions.find(condition => condition._id === initialCondition);
            setSelectedCondition(selectedCondition);
        }
    }, [initialCondition, conditions]);

    const handleConditionSelect = (condition) => {
        setSelectedCondition(condition);
        onConditionSelect(condition);
        setIsOpen(false);
    };

    return (
        <>
            <button type="button" onClick={() => setIsOpen(true)} className={"setting_element"}>
                <span>{translations.condition}</span>
                <div className={"fr g0-5 ai-c"}>
                    <span>{selectedCondition && translations.conditions && translations.conditions[selectedCondition.name] ? translations.conditions[selectedCondition.name] : ""  }</span>
                    <FaChevronRight/>
                </div>
            </button>

            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} padding={0} title="Select Condition">
                <ul>
                    {conditions.map((condition) => (
                        <li key={condition._id} onClick={() => handleConditionSelect(condition)} className={"setting_element"}>
                            <div className={"fr g1 ai-c"}>
                                {selectedCondition && selectedCondition._id === condition._id && <FaCheck/>}
                                <span>
                                    {translations.conditions && translations.conditions[condition.name] || condition.name}
                                </span>
                            </div>
                        </li>
                    ))}
                </ul>
            </Modal>
        </>
    );
}

export default ConditionSelector;