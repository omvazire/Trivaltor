/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../config/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    const saved = localStorage.getItem('trivaltor-language');
    // Default to 'en' (English)
    return (saved === 'mr' || saved === 'hi') ? saved : 'en';
  });

  useEffect(() => {
    localStorage.setItem('trivaltor-language', language);
  }, [language]);

  const setLanguage = (lang) => {
    if (lang === 'en' || lang === 'mr' || lang === 'hi') {
      setLanguageState(lang);
    }
  };

  // Translation function
  const t = (key) => {
    if (!key) return '';
    const langDict = translations[language] || translations['en'];
    if (langDict && langDict[key] !== undefined) {
      return langDict[key];
    }
    // Fallback to English dictionary if key is missing in active language
    const fallbackDict = translations['en'];
    if (fallbackDict && fallbackDict[key] !== undefined) {
      return fallbackDict[key];
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
