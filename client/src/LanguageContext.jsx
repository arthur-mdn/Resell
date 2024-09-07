// LanguageContext.jsx
import React, { useContext, useState, useEffect } from 'react';

const LanguageContext = React.createContext();

export const useLanguage = () => {
    return useContext(LanguageContext);
};

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(localStorage.getItem('language') || 'fr');
    const [translations, setTranslations] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadTranslations = async () => {
            setIsLoading(true); 

            try {
                const generalTranslations = await import(`./translations/${language}.json`);

                const [categoryTranslations] = await Promise.all([
                    import(`./translations/categories/${language}.json`),
                ]);

                setTranslations({
                    ...generalTranslations.default,
                    categories: categoryTranslations.default
                });

                localStorage.setItem('language', language);
            } catch (error) {
                console.error("Error loading translations:", error);
            } finally {
                setIsLoading(false); 
            }
        };

        loadTranslations();
    }, [language]);

    const changeLanguage = (lang) => {
        setLanguage(lang);
    };

    return (
        <LanguageContext.Provider value={{ language, translations, changeLanguage, isLoading }}>
            {children}
        </LanguageContext.Provider>
    );
};