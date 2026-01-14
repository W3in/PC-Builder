// i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import vi from './locales/vi.json';
import en from './locales/en.json';
import ja from './locales/ja.json';

const savedLanguage = localStorage.getItem('app_language') || 'vi';

i18n
    .use(initReactI18next)
    .init({
        resources: {
            vi: { translation: vi },
            en: { translation: en },
            ja: { translation: ja },
        },
        lng: savedLanguage,
        fallbackLng: "vi",
        interpolation: { escapeValue: false },
    });

i18n.on('languageChanged', (lng) => {
    localStorage.setItem('app_language', lng);
});

export default i18n;