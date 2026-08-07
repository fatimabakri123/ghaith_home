import { createContext, useContext, useEffect, useState } from "react";
import en from "../i18n/eng";
import ar from "../i18n/arb";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "en"
  );

  const translations = language === "ar" ? ar : en;

  useEffect(() => {
    localStorage.setItem("language", language);

    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((current) => (current === "en" ? "ar" : "en"));
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t: translations,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}